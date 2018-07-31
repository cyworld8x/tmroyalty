import React from 'react';
import {
  Switch,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { RkComponent } from 'react-native-ui-kitten';

/**
 * `RkSwitch` is a component which looks like a standard iOS switch on both platforms.
 *
 * @extends RkComponent
 *
 * @example Simple usage example:
 *
 * ```
 * <RkSwitch value={this.state.value}
 *           onValueChange={() => this.setState({value: !this.state.value})}/>
 * ```
 *
 * @example Color settings
 *
 * As in a standard react-native's Switch,
 * colors of the control can be configured via appropriate props:
 *
 * ```
 * <RkSwitch tintColor='blue' onTintColor='yellow' thumbTintColor='purple'
 *           value={this.state.value}
 *           onValueChange={() => this.setState({value: !this.state.value})} />
 * ```
 *
 *
 * @example Using rkType prop
 *
 * `RkSwitch` has `rkType` prop. This prop works similar to CSS-class in web.
 * It is possible to set more than one type.
 * There is a possibility to control tint colors via rkTypes.
 * The library already contains some predefined types and also it is possible to create new ones:
 *
 * ```
 * RkTheme.setType('RkSwitch', 'mySwitch', {
 *     tintColor: 'blue',
 *     onTintColor: 'yellow',
 *     thumbTintColor: 'purple',
 *     margin: 10
 * });

 * <RkSwitch rkType='danger' value={this.state.value}
 *           onValueChange={() => this.setState({value: !this.state.value})} />
 * <RkSwitch rkType='mySwitch' value={this.state.value}
 *           onValueChange={() => this.setState({value: !this.state.value})} />
 *
 * ```
 *
 * @styles Available style properties:
 * - `tintColor` : will be converted into `tintColor` prop of `Switch`
 * - `onTintColor` : will be converted into `onTintColor` prop of `Switch`
 * - `thumbTintColor` : will be converted into `thumbTintColor` prop of `Switch`
 * - ...: Any other style properties will be applied to `View` container.
 *
 *
 * @property {string} rkType - Types for component stylization
 * By default `RkSwitch` supports following types: `primary`, `warning`, `danger`, `success`, `info`
 * @property {style} style - Style for `View` container
 * @property {Switch.props} props - All `Switch` props also applied to `RkSwitch`
 */

export class RkSwitch extends RkComponent {
  componentName = 'RkSwitch';
  typeMapping = {
    component: {},
  };
  static propTypes = {
    disabled: PropTypes.bool,
    onTintColor: PropTypes.string,
    onValueChange: PropTypes.func,
    thumbTintColor: PropTypes.string,
    tintColor: PropTypes.string,
    value: PropTypes.bool,
  };
  static defaultProps = {
    disabled: false,
    onTintColor: '#53d669',
    thumbTintColor: '#ffffff',
    tintColor: '#e5e5e5',
    value: false,
  };

  defineStyles(additionalTypes) {
    const { component } = super.defineStyles(additionalTypes);
    const switchStyles = {
      onTintColor: this.extractNonStyleValue(component, 'onTintColor'),
      thumbTintColor: this.extractNonStyleValue(component, 'thumbTintColor'),
      tintColor: this.extractNonStyleValue(component, 'tintColor'),
    };
    return { componentStyles: component, switchStyles };
  }

  render() {
    const {
      onTintColor,
      thumbTintColor,
      tintColor,
      rkType,
      style,
      ...restProps
    } = this.props;
    const { componentStyles, switchStyles } = this.defineStyles(rkType);
    return (
      <View style={[componentStyles, style]}>
        <Switch
          onTintColor={switchStyles.onTintColor || onTintColor}
          thumbTintColor={switchStyles.thumbTintColor || thumbTintColor}
          tintColor={switchStyles.tintColor || tintColor}
          {...restProps}
        />
      </View>
    );
  }
}
