import React from 'react';
import { TextInput, View, Text } from 'react-native';
import {
    RkButton,
    RkText,
    RkTextInput,
    RkStyleSheet,
    RkTheme,
    RkAvoidKeyboard
  } from 'react-native-ui-kitten';
/**
 * to be wrapped with redux-form Field component
 */
export default function TmTextInput(props) {
  const { input, meta, ...inputProps } = props;

  const formStates = ['active', 'autofilled', 'asyncValidating', 'dirty', 'invalid', 'pristine',
    'submitting', 'touched', 'valid', 'visited'];

  return (
    <View>
      <RkTextInput
        {...inputProps}
        onChangeText={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={input.value}
      />
      <Text>The { input.name} input is:</Text>
      {
        formStates.filter((state) => meta[state]).map((state) => {
          return <Text key={state}> - { state }</Text>;
        })
      }
    </View>
  );
}