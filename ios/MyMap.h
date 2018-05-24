//  Created by react-native-create-bridge

// import UIKit so you can subclass off UIView
#import <UIKit/UIKit.h>

@class RCTEventDispatcher;

@interface MyMap : UIView

  // Initializing with the event dispatcher allows us to communicate with JS
  - (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

//@property (nonatomic, assign) NSString *lat;
//@property (nonatomic, assign) NSString *lon;

@end
