import React, { Component } from 'react';
import { Text, View, WebView, Platform, Linking } from 'react-native';

const initialUrl = 'https://www.scavengerhunt.com/app/?ios=true';
let url = '';

class Register extends Component {

  state = {
    url: initialUrl,
    selectedHunt: ''
  };

  componentWillMount() {
    setInterval(() => {
      if (global.selectedHunt !== this.state.selectedHunt) {
        this.setState({ selectedHunt: global.selectedHunt });
        this.setState(this.state);
        this.forceUpdate();
      }
    }, 1);
  }

  render() {
    const { url } = this.state;
    return (
      <View style={{
        ...Platform.select({
            ios: {
              paddingTop: 24,
            },
            android: {
              paddingTop: 0,
            },
          }),
          flex: 1}}>
        {/*<Text style={{backgroundColor: 'black', color: 'white'}}>{ global.url }</Text>*/}
        <WebView
        ref={(ref) => { this.webview = ref; }}
        key={this.state.selectedHunt}
        style={{ flex: 1}}
          source={{
            uri: global.selectedHunt !== '' ? 'https://www.scavengerhunt.com/app/group_type.php?hunt_id='.concat(global.selectedHunt) : initialUrl,
          }}
          onNavigationStateChange={(event) => {
          if (global.url !== event.url) {
            global.url = event.url;
            this.setState({ url: event.url })
          }
          if (event.url.indexOf('utm_source=app') > 10) {
            if (event.url.indexOf('/app/') === -1) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
            }
          }
          if (event.url.indexOf('google') > 10) {
            if (event.url.indexOf('/app/') === -1) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
            }
          }
        }}
          startInLoadingState
          scalesPageToFit
          javaScriptEnabled
        />
      </View>
    );
  }
}

export default Register;
