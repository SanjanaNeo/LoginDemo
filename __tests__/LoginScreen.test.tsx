import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

describe('LoginScreen', () => {
  test('renders title correctly', () => {
    const {getByText} = render(<LoginScreen />);
    const titleElement = getByText('Welcome');
    expect(titleElement).toBeDefined();
  });

  test('displays error message for invalid email format', () => {
    const {getByPlaceholderText, getByText} = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'invalid-email-format');
    fireEvent.press(getByText('Login'));
    const errorMessageElement = getByText('Invalid email format.');
    expect(errorMessageElement).toBeDefined();
  });

  test('displays error message for empty email', () => {
    const {getByPlaceholderText, getByText} = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, '');
    fireEvent.press(getByText('Login'));
    const errorMessageElement = getByText('Email is required.');
    expect(errorMessageElement).toBeDefined();
  });
});
