// data for the Study
var startDate = '2015-01-01';
var endDate = '2020-01-01';


//study Area
var studyArea = table // upload or link the HKH region or the region you wish to create time series animation



// Fetch a MODIS NDVI collection and select NDVI.
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1').select('NDVI');



// Define the regional bounds of animation frames matched to study area
var region = ee.Geometry.Polygon(
  [[[72.877670, 37.130650],
    [80.872659, 37.273417],
    [72.877670, 33.704852],
    [80.872659, 33.704852]]],
  null, false
);



// Add day-of-year (DOY) property to each image.
var col = dataset.map(function(img) {
  var doy = ee.Date(img.get('system:time_start')).getRelative('day', 'year');
  return img.set('doy', doy);
});


// Get a collection of distinct images by 'doy'.
var distinctDOY = col.filterDate(startDate, endDate);


// Define a filter that identifies which images from the complete
// collection match the DOY from the distinct DOY collection.
var filter = ee.Filter.equals({leftField: 'doy', rightField: 'doy'});


// Define a join.
var join = ee.Join.saveAll('doy_matches');


// Apply the join and convert the resulting FeatureCollection to an
// ImageCollection.
var joinCol = ee.ImageCollection(join.apply(distinctDOY, col, filter));



// Apply median reduction among matching DOY collections.
var comp = joinCol.map(function(img) {
  var doyCol = ee.ImageCollection.fromImages(
    img.get('doy_matches')
  );
  return doyCol.reduce(ee.Reducer.median());
});



// Define RGB visualization parameters.
var visParams = {
  min: 0.0,
  max: 9000.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};


// Create RGB visualization images for use as animation frames.
var rgbVis = comp.map(function(img) {
  return img.visualize(visParams).clip(studyArea);
});



// Define GIF visualization arguments.
var gifParams = {
  'region': region,
  'dimensions': 600,
  'crs': 'EPSG:3857',
  'framesPerSecond': 120,
  'format': 'gif'
};


// Print the GIF URL to the console.
print(rgbVis.getVideoThumbURL(gifParams));


// Render the GIF animation in the console.
print(ui.Thumbnail(rgbVis, gifParams));


// Export NDVI GIF to Google Drive
Export.video.toDrive({
  collection: rgbVis,              // NDVI frames
  description: 'MODIS_NDVI_GIF',   // Name in Drive
  dimensions: 720,                 // Output size
  framesPerSecond: 10,             // Adjust speed (lower = slower animation)
  region: region,                  // Same as your study region
  crs: 'EPSG:3857'                 // Projection
});
