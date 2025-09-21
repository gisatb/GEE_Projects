// var district_name = 'GOALPARA' 
// var roi = ee.FeatureCollection('users/atulmncfc/india_districts_updated_karan_sir')
//                 .filter(ee.Filter.eq('DISTRICT', district_name ));
                 
Map.addLayer(roi, {color: 'red', width: 6}, "roi",0) 
Map.centerObject(roi, 8)
Map.setOptions('Terrain')

var sentinel1= ee.ImageCollection("COPERNICUS/S1_GRD")
                .filterBounds(roi)
                .filter(ee.Filter.eq('instrumentMode','IW'))
                .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
                .filter(ee.Filter.eq('orbitProperties_pass','ASCENDING'))
                .select('VH')


///  Date Range                
var beforeA='2024-05-01'
var beforeB='2024-06-30'
var afterA= '2024-07-01'
var afterB= '2024-07-03'  

var beforecolection = sentinel1.filterDate(beforeA,beforeB)
var aftercollection  = sentinel1.filterDate(afterA,afterB)

print(beforecolection,'Images_before')  
print(aftercollection,'Images_after') 

/// Mosaic
var beforecollection =sentinel1.filterDate(beforeA,beforeB).mosaic().clip(roi)
var aftercollection  = sentinel1.filterDate(afterA,afterB).mosaic().clip(roi)

Map.addLayer(beforecollection, {min: -25, max: 0}, "Before Flood", 0)
Map.addLayer(aftercollection, {min: -25, max: 0}, "After Flood", 0)

var smoothingRadius = 50
var BC_filtered = beforecollection.focal_median(smoothingRadius,'circle', 'meters')
var AF_filtered = aftercollection.focal_median(smoothingRadius,'circle', 'meters')

// Flood Extent calculation
var difference =AF_filtered.divide(BC_filtered)

var Threshold= 1.25
var flooded1 = difference.gt(Threshold).rename('waterbodies').selfMask()


// permanent water bodies

var water_bodies = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select('seasonality').clip(roi)
var Permanent_water = water_bodies.gte(10)
print(Permanent_water,'PM')

Map.addLayer(Permanent_water,{min:0, max:1, pallete:['white','blue']},'permanent_water',0) 

var flooded_mask = flooded1.where(Permanent_water,0)
var flooded2 = flooded_mask.updateMask(flooded_mask)
Map.addLayer(flooded_mask, {min:0, max: 1, palette: ['white','red']},'Flood Extent')
/// mask out slope

var terrain = ee.Algorithms.Terrain(ee.Image('WWF/HydroSHEDS/03VFDEM'))
var slope = terrain.select('slope')

var slope_threshold = 5
var flooded3= flooded2.updateMask(slope.lt(slope_threshold))

/// eliminate those connnected to 8 or fewer neighbours/isolated pixels
var cp_threshold = 8
var connections =flooded3.connectedPixelCount()
var flooded4 = flooded3.updateMask(connections.gt(cp_threshold))

Map.addLayer(flooded4, {min:0, max: 1, palette: ['white','red']},'Flood Extent')

///Flood Extent Area
var flood_pixelarea = flooded4.multiply(ee.Image.pixelArea())
var flood_stats = flood_pixelarea.reduceRegion({
  reducer:ee.Reducer.sum(),
  geometry:roi,
  scale:10,
  maxPixels: 1e13
})

var floodAreaHa = ee.Number(flood_stats.get('waterbodies')).divide(10000).round()
print('Flooded area (Ha)',floodAreaHa)

///Impact Assessment
var lc = ee.ImageCollection('ESA/WorldCover/v200')
print(lc,'Land Cover')

var landcover = lc.mosaic().clip(roi)

var cropland = landcover.select('Map').eq(40).selfMask()
var affectedcropland = flooded4.updateMask(cropland).rename('crop')

var crop_pixelarea = affectedcropland.multiply(ee.Image.pixelArea())
var crop_stats = crop_pixelarea.reduceRegion({
  reducer:ee.Reducer.sum(),
  geometry:roi,
  scale:10,
  maxPixels: 1e13
})

var Affectedcropland_Area = ee.Number(crop_stats.get('crop')).divide(10000).round()
print('Flood Affected cropland Area (Ha)',Affectedcropland_Area)

//Builtup

var builtup = landcover.select('Map').eq(50).selfMask()
var affectedbuiltup = flooded4.updateMask(builtup).rename('builtup')

// calculate the area of affected buildup area in hectares
var built_pixelarea = affectedbuiltup.multiply(ee.Image.pixelArea())
var builtup_stats = built_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry:roi,
  scale:10,
  maxPixels:1e13,
})

var AffectedBuiltup_AreaHa = ee.Number(builtup_stats.get('builtup')).divide(10000).round()
print('Affected Builtup Area Ha', AffectedBuiltup_AreaHa)

///Display
var title = ui.Label('Assam Flood-July 2024',{
  fontWeight: 'bold',
  fontSize: '30px',
  margin: '10px 0',
})

Map.add(title)

var results =ui.Panel({
  style: {
    position:'bottom-right',
    padding:'8px 15px',
    width: '300px'}
});

var titleTextvis = {
  'margin': '0px 0px 15px 0px',
  'fontSize': '16px',
  'color': 'black',
  }

var textvis = {
  'margin': '0px 8px 2px 0px',
  'fontSize': '12px',
  'fontWeight':'red',
  'font-weight': 'bold',
  'color' : 'black'
} 
var numbervis ={
  'margin': '0px 0px 15px 0px',
  'fontSize' : '12px',
  'color' : 'red',
  'fontWeight':'bold'
}
var subtextvis = {
  'margin' : '0px 0px 2px 0px',
  'fontSize' :'12px',
  'color' : 'grey'
}



var titleLable = ui.Label('IMPACT_Assam_Flood_July ',titleTextvis)
var text1 = ui.Label('Flood TimeLine:', textvis)
var text1data =ui.Label(afterA.concat(' and ', afterA), numbervis)

var text2 = ui.Label('Estimated Flood Extent:', textvis)
var text2data = ui.Label('Please wait...',numbervis)

floodAreaHa.evaluate(function (val){
  text2data.setValue(val + ' hectares')})
  
var text3 = ui.Label('Estimated Cropland Area Affected: ', textvis)
var text3data = ui.Label('Please wait...', numbervis)

Affectedcropland_Area.evaluate(function(val){
  text3data.setValue(val + ' hectares')})

var text4 = ui.Label('Estimated Built-Up Area Affected: ', textvis)
var text4data = ui.Label('Please wait...', numbervis)

AffectedBuiltup_AreaHa.evaluate(function(val){
  text4data.setValue(val + ' hectares')
})

var text6 = ui.Label('Dataset:',textvis)
var text7 = ui.Label('Sentinel-1 SAR GRD: C-band Synthetic Aperture Radar Ground Range Detected',subtextvis)
var text8 = ui.Label('JRC Global Surfcae Water mapping layers',subtextvis)
var text9 = ui.Label('WWF HydroSHEDS Void-Filled DEM, 3 Arc-Seconds', subtextvis)
var text10 = ui.Label('ESA WorldCover 10mv200', subtextvis)
var prepared = ui.Label('Prepared By:',textvis)
var preparedby = ui.Label('Atul Bhardwaj', subtextvis)
var script = ui.Label('Reference', textvis)
var scriptlink = ui.Label('UN-SPIDER',subtextvis)

results.add(ui.Panel([
  titleLable,
  text1,
  text1data,
  text2,
  text2data,
  text3,
  text3data,
  text4,
  text4data,
  text6,
  text7,
  text8,
  text9,
  text10,
  prepared,
  preparedby,
  script,
  scriptlink
  ]))
  
  Map.add(results)