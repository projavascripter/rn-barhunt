import React, { Component } from 'react';
import {
  Text,
  View,
  Platform, Alert, Image, Linking, ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import { Card, CardSection, Button, Input, Spinner } from '../../common/';
import Selector from '../../common/Selector';
import ModalPicker from 'react-native-modal-selector'


class RegistrationTeamInfo extends Component {
  state = { name: '', email: '', purchaseMethod: '', voucherCode: '', error: '', loading: false }



  loginSuccess() {
    this.setState({
      email: '',
      name: '',
      purchaseMethod: '',
      voucherCount: '',
      voucherCode: '',
      error: '',
      loading: false,
      data: ''
    });
  }

  generateJSON() {
    const data = {
      email: this.state.email,
      name: this.state.name,
      purchaseMethod: this.state.purchaseMethod,
      voucherCount: this.state.voucherCount,
      voucherCode: this.state.voucherCode,
    };
    this.setState({ data: JSON.stringify(data)})
    Alert.alert(this.state.data);
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size='small' />;
    }
      return (
      <Button onPress={() => console.log('Hi')}>
        Log in
      </Button>);
  }
  renderVoucherCount() {
    const voucherCountOptions = [
        { key: 2, label: '2 Vouchers' },
        { key: 4, label: '4 Vouchers' },
        { key: 6, label: '6 Vouchers' },
        { key: 8, label: '8 Vouchers' },
        { key: 10, label: '10 Vouchers' },
    ];
    if (this.state.purchaseMethod === 'website' || this.state.purchaseMethod === '') {
      return (
        <View />
      );
   }
   return (
     <CardSection>
       <View style={styles.containerStyle}>
         <Text style={styles.labelStyle}>Voucher Count</Text>
         <ModalPicker
             data={voucherCountOptions}
             style={styles.inputStyle}
             initValue="How many players?"
             onChange={(option) => { this.setState({ voucherCount: `${option.key}` }); }} />
       </View>
     </CardSection>
   );
 }
  render() {
    let index = 0;
    const purchaseOptions = [
        { key: 'website', label: 'Our Website' },
        { key: 'groupon', label: 'Groupon' },
        { key: 'livingsocial', label: 'LivingSocial' },
        { key: 'other', label: 'Other' },
    ];
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
      <Card>
        <CardSection>
          <Input
           placeholder='Janey Hunter'
           label='Purchaser Name' // this is a prop
           value={this.state.name}
           onChangeText={name => this.setState({ name })}
           style={{ heigh: 20, width: 300 }}
          />
        </CardSection>

        <CardSection>
          <Input
           placeholder='hunting@gmail.com'
           label='Purchaser Email' // this is a prop
           value={this.state.email}
           onChangeText={email => this.setState({ email })}
           style={{ heigh: 20, width: 300 }}
          />
        </CardSection>

        <CardSection>
          <View style={styles.containerStyle}>
            <Text style={styles.labelStyle}>Purchase Method</Text>
            <ModalPicker
                data={purchaseOptions}
                style={styles.inputStyle}
                initValue="How did you buy?"
                onChange={(option) => { this.setState({ purchaseMethod: `${option.key}` }); }} />
          </View>
        </CardSection>
        {this.renderVoucherCount()}
        <CardSection>
          <Input
           placeholder='0000000'
           label='Voucher Code' // this is a prop
           value={this.state.voucherCode}
           onChangeText={voucherCode => this.setState({ voucherCode })}
           style={{ heigh: 20, width: 300 }}
          />
        </CardSection>

        <Text
        style={{
          fontSize: 20,
          alignSelf: 'center',
          color: 'red'
      }}>
          {this.state.error}
        </Text>

        <CardSection>
        <TouchableOpacity onPress={() => { this.generateJSON(); }} style={styles.buttonGreenStyle}>
          <Text style={styles.buttonGreenTextStyle}>
            Submit Info
          </Text>
        </TouchableOpacity>

        </CardSection>
        <CardSection>

        <TouchableOpacity onPress={() => Alert.alert(this.state.purchaseMethod)} style={styles.buttonWhiteStyle}>
          <Text style={styles.buttonWhiteTextStyle}>
            Add/Combine A Second Voucher
          </Text>
        </TouchableOpacity>
        </CardSection>
      </Card>
      </ScrollView>
    );
  }
}



const styles = {
  buttonGreenStyle: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#52AF52',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5
  },
  buttonGreenTextStyle: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonWhiteStyle: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderColor: '#CCC',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  buttonWhiteTextStyle: {
    alignSelf: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10
  },
  container: {
    position: 'absolute',
      ...Platform.select({
          ios: {
            top: 0,
          },
          android: {
            top: 0,
          },
        }),
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  TextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  TitleStyle: {
    fontSize: 18
  },
  ThumbnailStyle: {
    height: 50,
    width: 50
  },
  ArtworkStyle: {
    height: 250,
    flex: 1,
    width: null,
  },
  headerViewStyle: {
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    height: 50,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row'
  },
  headerTextStyle: {
      fontSize: 20
  },
  ThumbNailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  inputStyle: {
    paddingRight: 5,
    paddingLeft: 5,
    flex: 2.5
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 10,
    flex: 1
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default RegistrationTeamInfo;
