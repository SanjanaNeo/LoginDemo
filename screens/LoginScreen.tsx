import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await auth().signInWithEmailAndPassword(email, password);
      setIsLoading(false);
      // If login is successful, reset the email and password fields
      setEmail('');
      setPassword('');
      // Navigate to DummyPostsScreen
      Alert.alert(
        'Login Successful',
        'Welcome back, ' + response.user.email + '!',
      );
      navigation.navigate('DummyPosts');
    } catch (error) {
      setIsLoading(false);
      // Handle login error
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.',
      );
      setEmail('');
      setPassword('');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Registration');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordInputRef}
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F3E6', // Light beige background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#E9B44C', // Light orange border color
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E9B44C', // Light orange border color
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingLeft: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#FF5722', // Vibrant orange button color
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#4CAF50', // Vibrant green button color
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
