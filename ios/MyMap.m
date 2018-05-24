//  Created by react-native-create-bridge
#import <Foundation/Foundation.h>
#import "MyMap.h"
#import <GoogleMaps/GoogleMaps.h>

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatch(nonatomic) (nonatomic) e(nonatomic) r.h” // Required when used as a Pod in a Swift project
#endif


@implementation MyMap : UIView  {

  RCTEventDispatcher *_eventDispatcher;
  UIView *_childView;
  
  GMSMarker *marker;
  NSString *latitude;
  NSString *longitude;

}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  if ((self = [super init])) {
    _eventDispatcher = eventDispatcher;
    _childView = [[UIView alloc] init];
    _childView.backgroundColor = [UIColor redColor];
//    NSLog(@"we created child view");
  }

  return self;
}

// secondly, this method is called
- (void)layoutSubviews {
  [super layoutSubviews];
  
//  NSLog(@"lay out subview");

  // convert lan and lon to double
  double lan = [latitude doubleValue];
  double lon = [longitude doubleValue];

  // set camera
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:lan longitude:lon zoom:15];
  GMSMapView *mapView = [GMSMapView mapWithFrame:self.bounds camera:camera];
  mapView.myLocationEnabled = YES;
  [self addSubview:mapView];

  // add marker
  GMSMarker *marker = [[GMSMarker alloc] init];
  marker.position = CLLocationCoordinate2DMake(lan, lon);
  marker.title = @"Test Title";
  marker.snippet = @"Test Snippet";
  marker.map = mapView;
  
  
//
//  GMSMarker *marker2 = [[GMSMarker alloc] init];
//  marker2.position = CLLocationCoordinate2DMake(-33.86, 152.20);
//  marker2.title = @"Sydney1";
//  marker2.snippet = @"Australi1a";
//  marker2.map = mapView;
//
  
}


// first, properties are set
-(void)setLat:(NSString *)lat {
  latitude = lat;
}

-(void)setLon:(NSString *)lon {
  longitude = lon;
}


@end
