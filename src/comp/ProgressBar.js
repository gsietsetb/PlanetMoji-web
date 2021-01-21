import C, {apply} from 'consistencss';
import React, {useCallback, useEffect, useState} from 'react';
import {Animated, Easing, Text, TouchableOpacity, View} from 'react-native';
import {BASE_PIXEL, bgColor, bordColor, colors, gradGold, isWeb, shadow} from '../gStyles';
import {pickRandom} from '../stores/utils';

const ProgressBar = (props) => {
  const {
    height = 12,
    progress = 40,
    animated,
    indeterminate,
    progressDuration,
    indeterminateDuration,
    onCompletion,
    noFlex = '70%',
    backgroundColor = colors.sand,
    trackColor = colors.paleGrey,
  } = props;

  const [timer] = useState(new Animated.Value(0));
  const [width] = useState(new Animated.Value(0));

  const indeterminateAnimation = Animated.timing(timer, {
    duration: indeterminateDuration,
    toValue: 1,
    useNativeDriver: false,
    isInteraction: false,
  });

  useEffect(() => {
    if (!isWeb && (indeterminate || typeof progress === 'number')) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [indeterminate, progress, startAnimation, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (indeterminate) {
      timer.setValue(0);
      Animated.loop(indeterminateAnimation).start();
    } else {
      Animated.timing(width, {
        duration: animated ? progressDuration : 0,
        useNativeDriver: false,
        toValue: progress,
      }).start(() => {
        onCompletion();
      });
    }
  }, [animated, indeterminate, indeterminateAnimation, onCompletion, progress, progressDuration, timer, width]);

  const stopAnimation = useCallback(() => {
    if (indeterminateAnimation) {
      indeterminateAnimation.stop();
    }

    Animated.timing(width, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [indeterminateAnimation, width]);

  const styleAnimation = () => {
    return indeterminate
      ? {
          transform: [
            {
              translateX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-0.6 * 320, -0.5 * 0.8 * 320, 0.7 * 320],
              }),
            },
            {
              scaleX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.0001, 0.8, 0.0001],
              }),
            },
          ],
        }
      : {
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        };
  };

  const styles = {
    container: apply(bordColor(backgroundColor, 1), {
      width: '100%',
      height,
      overflow: 'hidden',
      borderRadius: height / 2,
      minWidth: noFlex,
    }),
    progressBar: {
      flex: 1,
      borderRadius: height / 2,
    },
  };

  return (
    <View>
      <Animated.View useNative style={[styles.container, {backgroundColor: trackColor}]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor,
              ...styleAnimation(),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

ProgressBar.defaultProps = {
  state: 'black',
  height: 2,
  progress: 0,
  animated: true,
  indeterminate: false,
  indeterminateDuration: 1100,
  progressDuration: 1100,
  onCompletion: () => {},
};

export default ProgressBar;

export const TrackBar = ({
  progress = 0.4,
  maxWidth = 11 * BASE_PIXEL,
  height = BASE_PIXEL,
  wrapStyle,
  grad = gradGold,
  colBg = colors.paleGreyTwo,
  colAccent = grad(progress).toString(),
}) => (
  <View style={[wrapStyle, C.selfCenter]}>
    <View style={apply(C.radius4, bgColor(colBg), bordColor(colAccent, 1), {width: maxWidth, height: height + 1})} />
    <View
      style={apply(C.absolute, bgColor(colAccent), shadow(colAccent), C.radius4, {
        width: maxWidth * (progress > 1 ? progress / 100 : progress),
        height: height,
      })}
    />
  </View>
);

const options = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

export const SpinIcon = ({icon = '🎲', textStyle}) => {
  const [anim, setRotateValue] = useState(new Animated.Value(0));
  const [isSpinning, setSpinning] = useState(false);
  const [result, setResult] = useState(false);

  const Spinner = Animated.loop(
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );
  const startSpin = () => {
    anim.setValue(0);
    setSpinning(true);
    Spinner.start(() => startSpin());
  };
  const stopSpin = () => {
    anim.setValue(0);
    setSpinning(false);
    setResult(pickRandom(options, 1, true));
    Spinner.stop();
  };

  const RotateData = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={() => !result && (isSpinning ? stopSpin() : startSpin())}>
      {
        <Animated.Text
          /*source={icon}*/
          style={[textStyle, isSpinning && {transform: [{rotate: RotateData}]}]}>
          {icon}
        </Animated.Text>
      }
      {result && <Text style={textStyle}>{result.icon}</Text>}
    </TouchableOpacity>
  );
};
