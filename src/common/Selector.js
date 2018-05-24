import React, { Component, PropTypes } from 'react';

import {
    View,
    TextInput
} from 'react-native';

import ModalPicker from 'react-native-modal-selector';

class Selector extends Component {

    constructor() {
        super();

        this.state = {
            textInputValue: ''
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label: 'Our Website' },
            { key: index++, label: 'Groupon' },
            { key: index++, label: 'LivingSocial' },
            { key: index++, label: 'Other' },
        ];

        return (
            <View style={{flex:1}}>

                { /* Default mode: a clickable button will re rendered */ }
                <ModalPicker
                    data={data}
                    initValue="Select something yummy!"
                    onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }}/>
            </View>
        );
    }
}

export default Selector;
