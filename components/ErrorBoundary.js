// components/ErrorBoundary.js
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
      this.setState({errorInfo})
  }

  render() {
    if (this.state.hasError) {
        return (
            <View style={styles.container}>
               <Text style={[styles.errorText, { marginBottom: 20 }]}>
                  Something went wrong!
               </Text>
               {__DEV__ && (
                  <View style={{ marginBottom: 20 }}>
                       <Text style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>
                           Error Information:
                      </Text>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                          {this.state.error && this.state.error.toString()}
                        </Text>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                          {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </Text>
                  </View>
              )}
           </View>
       )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;