Map.setOptions('HYBRID');

//---------------------------------------------- ⚙️ Define year -------------------------------------------------------------//

var Year = 2024;
var Year1 = 2025;

//######################################################## Boundary ##########################################################//   

// 🗺️ AOI & mask (replace with your own)
var District = ['Neemuch']
var dist = ee.FeatureCollection("projects/media-463707/assets/neemach_disslove")
.filter(ee.Filter.inList('dist_nm', District));  // Replace with your shapefile or geometry
// Map.addLayer(dist,{},'roi')
////###################################################### Agriculture land Mask from the layer ######################################################

// var agri_mask1 = ee.Image('users/rk_rajkishore/Agri/LULC_UP/UP_Agri_Mask_YESTECH_17_Feb_25_final');
// var agri_mask =agri_mask1.updateMask(agri_mask1.eq(1)).clip(dist)     // Replace with your agri mask
var lulc2020 = ee.ImageCollection("ESA/WorldCover/v100").first().clip(dist);
var lulc2021 = ee.ImageCollection("ESA/WorldCover/v200").first().clip(dist);
var lulc1 = lulc2020.updateMask(lulc2020.eq(40)).clip(dist);
var lulc2 = lulc2021.updateMask(lulc2021.eq(40)).clip(dist);
var agri_mask = ee.ImageCollection([lulc1,lulc2]).max().clip(dist);


//######################################################  Run Sentinel-2A MSI Data ######################################################

// 🛰️ Sentinel-2 loader and index functions
var Optical = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").filterBounds(dist);

// Define fixed intervals manually
var S2A1 = Optical.filterDate(Year + '-10-01', Year + '-10-15');
var S2A2 = Optical.filterDate(Year + '-10-16', Year + '-10-30');
var S2A3 = Optical.filterDate(Year + '-11-01', Year + '-11-15');
var S2A4 = Optical.filterDate(Year + '-11-16', Year + '-11-30');
var S2A5 = Optical.filterDate(Year + '-12-01', Year + '-12-15');
var S2A6 = Optical.filterDate(Year + '-12-16', Year + '-12-30');
var S2A7 = Optical.filterDate(Year1 + '-01-01', Year1 + '-01-15');
var S2A8 = Optical.filterDate(Year1 + '-01-16', Year1 + '-01-30');
var S2A9 = Optical.filterDate(Year1 + '-02-01', Year1 + '-02-15');
var S2A10 = Optical.filterDate(Year1 + '-02-16', Year1 + '-02-28');
var S2A11 = Optical.filterDate(Year1 + '-03-01', Year1 + '-03-15');
var S2A12 = Optical.filterDate(Year1 + '-03-16', Year1 + '-03-30');
var S2A13 = Optical.filterDate(Year1 + '-04-01', Year1 + '-04-15');
var S2A14 = Optical.filterDate(Year1 + '-04-16', Year1 + '-04-30');
var S2A15 = Optical.filterDate(Year1 + '-05-01', Year1 + '-05-15');
var S2A16 = Optical.filterDate(Year1 + '-05-16', Year1 + '-05-30');

//###################################################### creating function for computing NDVI, evi and adding to each image in collection ######################################################

function addIndices(img) {
  var red = img.select('B4');
  var green = img.select('B3');
  var nir = img.select('B8');
  var blue = img.select('B2');

  var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');
  var evi = nir.subtract(red).multiply(2.5)
              .divide(nir.add(red.multiply(6)).subtract(blue.multiply(7.5)).add(1)).rename('EVI');

  return img.addBands([ndvi, evi]);
}

//###################################################### adding function to each collection ######################################################

var withNDVI1 = S2A1.map(addIndices);
var withNDVI2 = S2A2.map(addIndices);
var withNDVI3 = S2A3.map(addIndices);
var withNDVI4 = S2A4.map(addIndices);
var withNDVI5 = S2A5.map(addIndices);
var withNDVI6 = S2A6.map(addIndices);
var withNDVI7 = S2A7.map(addIndices);
var withNDVI8 = S2A8.map(addIndices);
var withNDVI9 = S2A9.map(addIndices);
var withNDVI10 = S2A10.map(addIndices);
var withNDVI11 = S2A11.map(addIndices);
var withNDVI12 = S2A12.map(addIndices);
var withNDVI13 = S2A13.map(addIndices);
var withNDVI14 = S2A14.map(addIndices);
var withNDVI15 = S2A15.map(addIndices);
var withNDVI16 = S2A16.map(addIndices);
//###################################################### creating a mosaic image wrt maximum value composite of NDVI for each collection ######################################################

var greenest1 = withNDVI1.qualityMosaic('NDVI').clip(dist);
var greenest2 = withNDVI2.qualityMosaic('NDVI').clip(dist);
var greenest3 = withNDVI3.qualityMosaic('NDVI').clip(dist);
var greenest4 = withNDVI4.qualityMosaic('NDVI').clip(dist);
var greenest5 = withNDVI5.qualityMosaic('NDVI').clip(dist);
var greenest6 = withNDVI6.qualityMosaic('NDVI').clip(dist);
var greenest7 = withNDVI7.qualityMosaic('NDVI').clip(dist);
var greenest8 = withNDVI8.qualityMosaic('NDVI').clip(dist);
var greenest9 = withNDVI9.qualityMosaic('NDVI').clip(dist);
var greenest10 = withNDVI10.qualityMosaic('NDVI').clip(dist);
var greenest11 = withNDVI11.qualityMosaic('NDVI').clip(dist);
var greenest12 = withNDVI12.qualityMosaic('NDVI').clip(dist);
var greenest13 = withNDVI13.qualityMosaic('NDVI').clip(dist);
var greenest14 = withNDVI14.qualityMosaic('NDVI').clip(dist);
var greenest15 = withNDVI15.qualityMosaic('NDVI').clip(dist);
var greenest16 = withNDVI16.qualityMosaic('NDVI').clip(dist);

// ------------------------------------------------------------ Compute NDVI and EVI for each composite ----------------------------------------------------------------------------- //
var ndvi1 = greenest1.select('NDVI').rename('NDVI_Oct1');
var ndvi2 = greenest2.select('NDVI').rename('NDVI_Oct2');
var ndvi3 = greenest3.select('NDVI').rename('NDVI_Nov1');
var ndvi4 = greenest4.select('NDVI').rename('NDVI_Nov2');
var ndvi5 = greenest5.select('NDVI').rename('NDVI_Dec1');
var ndvi6 = greenest6.select('NDVI').rename('NDVI_Dec2');
var ndvi7 = greenest7.select('NDVI').rename('NDVI_Jan1');
var ndvi8 = greenest8.select('NDVI').rename('NDVI_Jan2');
var ndvi9 = greenest9.select('NDVI').rename('NDVI_Feb1');
var ndvi10 = greenest10.select('NDVI').rename('NDVI_Feb2');
var ndvi11 = greenest11.select('NDVI').rename('NDVI_Mar1');
var ndvi12 = greenest12.select('NDVI').rename('NDVI_Mar2');
var ndvi13 = greenest13.select('NDVI').rename('NDVI_Apr1');
var ndvi14 = greenest14.select('NDVI').rename('NDVI_Apr2');
var ndvi15 = greenest15.select('NDVI').rename('NDVI_May1');
var ndvi16 = greenest16.select('NDVI').rename('NDVI_May2');

var evi1 = greenest1.select('EVI').rename('EVI_Oct1');
var evi2 = greenest2.select('EVI').rename('EVI_Oct2');
var evi3 = greenest3.select('EVI').rename('EVI_Nov1');
var evi4 = greenest4.select('EVI').rename('EVI_Nov2');
var evi5 = greenest5.select('EVI').rename('EVI_Dec1');
var evi6 = greenest6.select('EVI').rename('EVI_Dec2');
var evi7 = greenest7.select('EVI').rename('EVI_Jan1');
var evi8 = greenest8.select('EVI').rename('EVI_Jan2');
var evi9 = greenest9.select('EVI').rename('EVI_Feb1');
var evi10 = greenest10.select('EVI').rename('EVI_Feb2');
var evi11 = greenest11.select('EVI').rename('EVI_Mar1');
var evi12 = greenest12.select('EVI').rename('EVI_Mar2');
var evi13 = greenest13.select('EVI').rename('EVI_Apr1');
var evi14 = greenest14.select('EVI').rename('EVI_Apr2');
var evi15 = greenest15.select('EVI').rename('EVI_May1');
var evi16 = greenest16.select('EVI').rename('EVI_May2');
//// ###################################################### Stacked images ######################################################

var stackedImage = ee.Image.cat([ ndvi1, ndvi2, ndvi3, ndvi4, ndvi5, ndvi6, ndvi7, ndvi8, ndvi9, ndvi10, ndvi11, ndvi12, ndvi13, ndvi14, ndvi15, ndvi16,
  evi1, evi2, evi3, evi4, evi5, evi6, evi7, evi8, evi9, evi10, evi11, evi12, evi13, evi14, evi15, evi16]).clip(dist).updateMask(agri_mask);

var stacked_ndvi = ndvi1.addBands([ndvi2, ndvi3, ndvi4, ndvi5, ndvi6, ndvi7, ndvi8, ndvi9, ndvi10, ndvi11, ndvi12, ndvi13, ndvi14, ndvi15, ndvi16]).clip(dist).updateMask(agri_mask);

var stacked_evi = evi1.addBands([evi2, evi3, evi4, evi5, evi6, evi7, evi8, evi9, evi10, evi11, evi12, evi13, evi14, evi15, evi16]).clip(dist).updateMask(agri_mask);

var febCollection = withNDVI8.merge(withNDVI9);  // Combined Feb 1st & 2nd half jan
var febMedian = febCollection.median();

var ndmi_feb = febMedian.normalizedDifference(['B8', 'B11']).rename('NDMI_Feb').clip(dist).updateMask(agri_mask);

var janCollection = withNDVI6.merge(withNDVI7);  // Combined Jan 1st & 2nd half dec
var janMedian = janCollection.median();

var rgvi_jan = janMedian.select('B3').subtract(janMedian.select('B4'))
  .divide(janMedian.select('B3').add(janMedian.select('B4')))
  .rename('RGVI_Jan').clip(dist).updateMask(agri_mask);

var finalStack = stackedImage.addBands([ndmi_feb,rgvi_jan]);

//scaling NDVI within 100-200
var stackedImage_scaled = finalStack.multiply(100).add(100).uint8();


var bands = ['NDVI_Feb2', 'NDVI_Jan1', 'NDVI_Nov2'];
var display = {bands: bands, min: 0, max: 1};
Map.addLayer(stacked_ndvi, display, 'NDVI_stacked1');

var bands = ['EVI_Oct2', 'EVI_Nov2', 'EVI_Dec2'];
var display = {bands: bands, min: 0, max: 1.5};
Map.addLayer(stacked_evi, display, 'EVI_stacked1');

var display = {min: 0, max: 1};
Map.addLayer(ndmi_feb, display, 'ndmi_feb');
Map.addLayer(rgvi_jan, display, 'rgvi_jan');

var S2_bands = ['B8', 'B4', 'B3'];
var S2_display = {bands: S2_bands, min: 0, max: 4000};


// Map.addLayer(greenest1, S2_display, 'Oct1fn');     //displaying Dec1fn  data
Map.addLayer(greenest2, S2_display, 'Oct2fn');     //displaying Dec2fn  data
Map.addLayer(greenest3, S2_display, 'Nov1fn');     //displaying Dec1fn  data
Map.addLayer(greenest4, S2_display, 'Nov2fn');     //displaying Dec2fn  data
Map.addLayer(greenest5, S2_display, 'Dec1fn');     //displaying Dec1fn  data
// Map.addLayer(greenest6, S2_display, 'Dec2fn');     //displaying Dec2fn  data
// Map.addLayer(greenest7, S2_display, 'Jan1fn');     //displaying Dec1fn  data
// Map.addLayer(greenest8, S2_display, 'Jan2fn');     //displaying Dec2fn  data
Map.addLayer(greenest9, S2_display, 'Feb1fn');     //displaying Dec1fn  data
Map.addLayer(greenest10, S2_display, 'Feb2fn');     //displaying Dec2fn  data
Map.addLayer(greenest11, S2_display, 'Mar1fn');     //displaying Dec1fn  data
// Map.addLayer(greenest12, S2_display, 'Mar2fn');     //displaying Dec2fn  data
//////################################################################################# Refrence Data ##################################################################### 

var image1_1 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') 
                   .filterDate('2024-12-13', '2024-12-17') 
                   .filterBounds(dist)
                 // .filter(ee.Filter.eq('CLOUD_COVER', 50));
                  
var mosaic = image1_1.mosaic().select(['B3','B4','B8']).clip(dist);

print(image1_1);
var S2_bands = ['B8', 'B4', 'B3'];
var S2_display = {bands:S2_bands, min: 0, max: 4000};
Map.addLayer(mosaic, S2_display, 'sentinel_ref_data');

//////############################################################################################### Training_data ##################################################################### 

//------------------------------------Training Dataset------------------------------------------------//

var gt1 = poppy.merge(wheat).merge(other_crop).merge(other)

//------------------------------------------ Training --------------------------------------------------//
var training = stackedImage_scaled.sampleRegions({
  collection: gt1,
  properties: ['class'],
  scale: 10
});
 
Export.table.toDrive({description:District+'_sig_23', collection: training, fileFormat: 'CSV'});

//////###################################################################################  Make a Random Forest classifier ################################################################################# 


var classifier = ee.Classifier.smileRandomForest(1000)
    .train({
      features: training,
      classProperty: 'class',
      inputProperties: [ 'NDVI_Oct1','NDVI_Oct2','NDVI_Nov1','NDVI_Nov2', 'NDVI_Dec1', 'NDVI_Dec2', 'NDVI_Jan1','NDVI_Jan2','NDVI_Feb1','NDVI_Feb2','NDVI_Mar1','NDVI_Mar2','NDVI_Apr1','NDVI_Apr2','NDVI_May1','NDVI_May2',
      'EVI_Oct1','EVI_Oct2','EVI_Nov1','EVI_Nov2', 'EVI_Dec1', 'EVI_Dec2', 'EVI_Jan1','EVI_Jan2','EVI_Feb1','EVI_Feb2','EVI_Mar1','EVI_Mar2','EVI_Apr1','EVI_Apr2','EVI_May1','EVI_May2', 'NDMI_Feb', 'RGVI_Jan']
    });
//.setOutputMode('MULTIPROBABILITY')

var classified = stackedImage_scaled.classify(classifier);
var classified2 = classified.updateMask(agri_mask).clip(dist)
var wheat_2021_22_i = ee.Image(0).where(classified2.eq(1),1)

//------------------------------------------- Multiprobability ---------------------------------------------------//

// var WheatCrop =      classified2.arrayGet([0]).rename('WheatCrop');
// var Multiprob = ee.Image(0).where(WheatCrop.gt(T1),1)

///--------------------------------------cart------------------------------------------------//

// Classify the input imagery (CART).
// var classifier = ee.Classifier.smileCart().train({
//   features: training,
//   classProperty: 'class',
//   inputProperties: bands
// });

// var classified = stackedImage_scaled.classify(classifier);
// var rat = classified.updateMask(classified.eq(1));
// var nor = classified.updateMask(classified.eq(2));
// var doubt = classified.updateMask(classified.eq(3));
// var othr = classified.updateMask(classified.eq(4));
// // print(classified)
//Map.centerObject(training_data, 11);
//Map.addLayer(mosaic, {bands: ['B8', 'B4', 'B3'], max: 3000}, 'image');
// var classfied_r=ee.Image(0).where(rat.eq(1),1)
//                           .where(nor.eq(2),2)
//                           .where(doubt.eq(3),3)
//                           .where(othr.eq(4),4)
// var wheat_2021_22_i = classfied_r.updateMask(agri_mask).clip(dist);


var Palette = [
  'aec3d4', // water
  '152106',  // forest
  '6a2325',   // shrub, grass
  '111149', // wetlands
  'cdb33b', // croplands
  'cc0013', // urban
  '33280d', // crop mosaic
  'd7cdcc', // snow and ice
  'f7e084', // barren
  '6f6f6f'  // tundra
];

Map.addLayer(wheat_2021_22_i.selfMask(), {min: 0, max:1, palette: ['yellow','red']}, 'classification'); 


////################################################################################### Remove Non Crop Area #########################################//
// Remove pixels fron non-crop aoi(s)

var districtRefined_2022 = ee.Feature(dist.first()).difference(non_crop);
var wheat_2023_24 = wheat_2021_22_i.clip(districtRefined_2022) 

//////###################################################### Elimination Rule ###################################################### 



/////////////////// //#############################################  clasfied mask ############################################# ////////////////////////////////// 


// var lulc3 = ee.Image(1).where(wheat_refined.eq(1),0).clip(district);
// var deleted_wheat = mustard_2023_24.updateMask(lulc3)


/************************* Eliminater ****************************/

// var connectedPixelThreshold = 8;
// var connections = WheatImage.connectedPixelCount(25).updateMask(agri_mask)
// var Wheat_2025 = WheatImage.updateMask(connections.gt(connectedPixelThreshold)).updateMask(agri_mask)


//############################################# Area Calculation ############################################//     
 

 var Area = require('users/rk_rajkishore/JS_modules:tools');

var sugarane_area = Area.calculateClassArea(wheat_2023_24, dist, 10);
print('sugarane_area:', sugarane_area); 


//////
////#############################################  Export Classification Layer to the DRIVE ############################################# 

// Export Classification Layer to the DRIVE
Export.image.toDrive({ 
  image: stackedImage_scaled,
  scale: 10,
  folder : 'Sugarcane',
  description:dist+'_ndvi',
  region:dist,
  //crs: 'EPSG:32643',
  maxPixels:1e13
});

Export.image.toDrive({ 
  image: wheat_2023_24,
  scale: 10,
  folder : 'Sugarcane',
  description:dist+'_unsup_signature',
  region:dist,
  //crs: 'EPSG:32643',
  maxPixels:1e13
});


// var point_ee = ee.Geometry.Point(80.689714, 28.007101);
// Map.centerObject(point_ee);
// Map.addLayer(point_ee,{},'point_ee');
//############################################### Area ##############################################//

var areaImage = wheat_2023_24.selfMask().multiply(ee.Image.pixelArea());

var area = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: dist.geometry(),
  scale: 10,
  maxPixels: 1e10
});

var WheatAreaHa = ee.Number(area.get('constant')).divide(1e4).round();
print(WheatAreaHa, 'Wheat Area in hectares');


////////#############################################    Export Area as CSV.//////#############################################   

var calculateClassArea = function(feature) {
    var areas = ee.Image.pixelArea().addBands(wheat_2023_24.selfMask())
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'class',
    }),
    geometry: feature.geometry(),
    scale: 10,
    maxPixels: 1e13
    });
    
 
    var classAreas = ee.List(areas.get('groups'));
    var classAreaLists = classAreas.map(function(item) {
      var areaDict = ee.Dictionary(item);
      var classNumber = ee.Number(
        areaDict.get('class')).format();
      var area = ee.Number(
        areaDict.get('sum'));
      return ee.List([classNumber, area]);
    });
 
    var result = ee.Dictionary(classAreaLists.flatten());
    var ID = feature.get('DISTRICT');
    return ee.Feature(
      feature.geometry(),
      result.set('ID', ID));
};
 
var districtAreas = dist.map(calculateClassArea);
// print(districtAreas)
Export.table.toDrive({description:dist+'_wheat_clasification_2023-2024', collection: districtAreas.select(['.*'],null,false), fileFormat: 'CSV'});


////////#############################################  Get a confusion matrix representing resubstitution accuracy. #############################################  

var trainAccuracy = classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());

//////////#############################################   Sample the input with a different random seed to get validation data.#############################################

var validation = stacked_ndvi.sampleRegions({
  collection: gt1,
  properties: ['class'],
  scale: 10
});

//////////#############################################   Classify the validation data. .############################################# 

var validated = validation.classify(classifier);

////////////#############################################    Get a confusion matrix representing expected accuracy..############################################# 

var testAccuracy = validated.errorMatrix('class', 'classification');
print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', testAccuracy.accuracy());

// var areaImage = ee.Image.pixelArea().addBands(classified);
// var areas = areaImage.reduceRegion({
//       reducer: ee.Reducer.sum().group({
//       groupField: 1,
//       groupName: 'class',
//     }),
//     geometry: st,
//     scale: 10,
//     maxPixels: 1e10
//     }); 
//print(areas);

///////#############################################  For UI Chart ############################################# 

var bandInfo = {
  'NDVI': {v: 1, f: 'NDVI'},
  'NDVI1': {v: 2, f: 'NDVI1'},
  'NDVI2': {v: 3, f: 'NDVI2'},
  'NDVI3': {v: 4, f: 'NDVI3'},
  'NDVI4': {v: 5, f: 'NDVI4'},
  'NDVI5': {v: 6, f: 'NDVI5'},
  'NDVI6': {v: 7, f: 'NDVI6'},
  'NDVI7': {v: 8, f: 'NDVI7'},
  'NDVI8': {v: 9, f: 'NDVI8'},
  'NDVI9': {v: 10, f: 'NDVI9'},
  'NDVI10': {v: 11, f: 'NDVI10'},
  'NDVI11': {v: 12, f: 'NDVI11'},
  'NDVI12': {v: 13, f: 'NDVI12'},
  'NDVI13': {v: 14, f: 'NDVI13'},
  'NDVI14': {v: 15, f: 'NDVI14'},
  'NDVI15': {v: 16, f: 'NDVI15'},
  'NDVI16': {v: 17, f: 'NDVI16'}
};

var xPropVals = [];    // List to codify x-axis band names as values.
var xPropLabels = [];  // Holds dictionaries that label codified x-axis values.
for (var key in bandInfo) {
  xPropVals.push(bandInfo[key].v);
  xPropLabels.push(bandInfo[key]);
}
var regionsBand =
    gt1
        .reduceToImage({properties: ['class'], reducer: ee.Reducer.first()})
         .rename('class');

var sentinelSrClass = stacked_ndvi.addBands(regionsBand);
       // print(sentinelSrClass);
var chart = ui.Chart.image
                .byClass({
                  image: sentinelSrClass,
                  classBand: 'class',
                  region: gt1,
                  reducer: ee.Reducer.mean(),
                  scale: 10,
                  classLabels: ['', 'Wheat', 'Others','Others Crop'],
                  xLabels: xPropVals
                })
                .setChartType('ScatterChart')
                .setOptions({
                  title: 'Temporal NDVI',
                  hAxis: {
                    title: 'Fortnight Reflection',
                    titleTextStyle: {italic: false, bold: true},
                    viewWindow: {min: bands[0], max: bands[11]},
                    ticks: xPropLabels
                  },
                  vAxis: {
                    title: 'NDVI(Scaled)',
                    titleTextStyle: {italic: false, bold: true},
                    viewWindow: {min: 0, max: 1},
                  },
                  colors: ['red', 'blue', 'grey', 'green', 'yellow', 'magenta', 'cyan'],
                  pointSize: 0,
                  lineSize: 2,
                  curveType: 'function'
                });
print(chart); 

