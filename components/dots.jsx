import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const AnimatedDot = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity, delay]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
};

const AnimatedDots = () => {
  return (
    <View style={styles.container}>
      <AnimatedDot delay={0} />
      <AnimatedDot delay={250} />
      <AnimatedDot delay={500} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
});

export default AnimatedDots;