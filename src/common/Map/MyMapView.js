//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'

const MyMap = requireNativeComponent('MyMap', MyMapView)

export default class MyMapView extends Component {
  render () {
    return <MyMap {...this.props} />
  }
}
