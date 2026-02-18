// src/hooks/useForm.js
import { useState, useCallback } from 'react';

export const useForm = (initialState = {}, validators = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  // Handle blur (when field loses focus)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validators[name]) {
      const error = validators[name](formData[name], formData);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [formData, validators]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.entries(validators).forEach(([field, validator]) => {
      if (validator) {
        const error = validator(formData[field], formData);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validators]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  // Set form data
  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set multiple fields
  const setFields = useCallback((fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      // Validate form
      const isValid = validateForm();
      
      if (!isValid) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);
        return;
      }
      
      // Call onSubmit callback
      await onSubmit(formData);
      
    } catch (error) {
      setErrors(prev => ({ ...prev, _form: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Check if field has error
  const hasError = useCallback((field) => {
    return touched[field] && errors[field];
  }, [touched, errors]);

  // Get field props (for use with input components)
  const getFieldProps = useCallback((name) => ({
    value: formData[name] || '',
    onChange: (e) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    error: hasError(name) ? errors[name] : null
  }), [formData, handleChange, handleBlur, hasError, errors]);

  // Common validators
  const validatorsLibrary = {
    required: (message = 'This field is required') => 
      (value) => !value || (typeof value === 'string' && !value.trim()) ? message : null,
    
    email: (message = 'Please enter a valid email') => 
      (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
      },
    
    minLength: (min, message = `Minimum ${min} characters required`) => 
      (value) => value && value.length < min ? message : null,
    
    maxLength: (max, message = `Maximum ${max} characters allowed`) => 
      (value) => value && value.length > max ? message : null,
    
    pattern: (regex, message = 'Invalid format') => 
      (value) => value && !regex.test(value) ? message : null,
    
    match: (fieldName, message = 'Fields do not match') => 
      (value, allValues) => value === allValues[fieldName] ? null : message
  };

  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    
    // Actions
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFields,
    setFormData,
    
    // Helpers
    validateForm,
    hasError,
    getFieldProps,
    
    // Validators library
    validators: validatorsLibrary,
    
    // Form status
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(formData) !== JSON.stringify(initialState),
    canSubmit: Object.keys(errors).length === 0 && !isSubmitting
  };
};