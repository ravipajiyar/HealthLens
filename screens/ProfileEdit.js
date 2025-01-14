import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { Button, Input, Text, Slider } from '@rneui/themed';
import styles from '../styles';
import { getProfile, saveProfile } from '../utils/storage';

const ProfileEdit = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const savedProfile = await getProfile();
        if (savedProfile) {
            setProfile(savedProfile);
        }
        setLoading(false);
    };

    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const success = await saveProfile(profile);
        if (success) {
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    if (loading || !profile) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={[styles.container, {paddingTop: 20}]}>
                <Text h3>Edit Profile</Text>

                {/* Basic Information */}
                <Text h4 style={styles.sectionHeader}>Basic Information</Text>
                <Input
                    label="Name"
                    value={profile.name}
                    onChangeText={(value) => updateProfile('name', value)}
                />
                <Input
                    label="Age"
                    keyboardType="numeric"
                    value={profile.age.toString()}
                    onChangeText={(value) => updateProfile('age', value)}
                />
                <Input
                    label="Weight (kg)"
                    keyboardType="numeric"
                    value={profile.weight.toString()}
                    onChangeText={(value) => updateProfile('weight', value)}
                />
                <Input
                    label="Height (cm)"
                    keyboardType="numeric"
                    value={profile.height.toString()}
                    onChangeText={(value) => updateProfile('height', value)}
                />

                {/* Health Goals */}
                <Text h4 style={styles.sectionHeader}>Health Goals</Text>
                 {['Weight Loss', 'Muscle Gain', 'Maintain Health', 'Athletic Performance'].map((goal, index) => (
                  <TouchableOpacity
                      key={index}
                      style={
                          profile.healthGoals === goal
                              ? styles.selectedButtonGroupButton
                              : styles.buttonGroupButton
                      }
                      onPress={() => updateProfile('healthGoals', goal)}
                     >
                       <Text style={
                         profile.healthGoals === goal
                           ? styles.selectedButtonGroupText
                           : styles.buttonGroupText
                       }
                       >{goal}</Text>
                   </TouchableOpacity>
               ))}

                {/* Dietary Preferences */}
                <Text h4 style={styles.sectionHeader}>Dietary Preferences</Text>
                  {['None', 'Vegetarian', 'Vegan', 'Gluten-Free'].map((preference, index) => (
                    <TouchableOpacity
                       key={index}
                      style={
                       profile.dietaryPreferences.includes(index)
                            ? styles.selectedButtonGroupButton
                            : styles.buttonGroupButton
                       }
                        onPress={() => {
                          const newPreferences = [...profile.dietaryPreferences];
                          const position = newPreferences.indexOf(index);
                            if (position > -1) {
                                newPreferences.splice(position, 1);
                             } else {
                              newPreferences.push(index);
                            }
                             updateProfile('dietaryPreferences', newPreferences);
                         }}
                   >
                       <Text
                         style={
                              profile.dietaryPreferences.includes(index)
                               ? styles.selectedButtonGroupText
                               : styles.buttonGroupText
                         }
                       >{preference}</Text>
                    </TouchableOpacity>
                  ))}

                 {/* Allergies */}
                  <Text h4 style={styles.sectionHeader}>Allergies</Text>
                    {['None', 'Nuts', 'Dairy', 'Shellfish'].map((allergy, index) => (
                    <TouchableOpacity
                        key={index}
                       style={
                          profile.allergies.includes(index)
                            ? styles.selectedButtonGroupButton
                            : styles.buttonGroupButton
                      }
                        onPress={() => {
                          const newAllergies = [...profile.allergies];
                          const position = newAllergies.indexOf(index);
                            if (position > -1) {
                                newAllergies.splice(position, 1);
                            } else {
                                newAllergies.push(index);
                            }
                           updateProfile('allergies', newAllergies);
                         }}
                    >
                       <Text
                         style={
                           profile.allergies.includes(index)
                             ? styles.selectedButtonGroupText
                             : styles.buttonGroupText
                         }
                       >{allergy}</Text>
                   </TouchableOpacity>
                ))}


                {/* Lifestyle */}
                <Text h4 style={styles.sectionHeader}>Lifestyle</Text>
                   <Text>Activity Level</Text>
                    {['Sedentary', 'Moderate', 'Very Active'].map((activity, index) => (
                         <TouchableOpacity
                           key={index}
                            style={
                             profile.activityLevel === activity
                                ? styles.selectedButtonGroupButton
                                : styles.buttonGroupButton
                            }
                            onPress={() => updateProfile('activityLevel', activity)}
                          >
                            <Text style={
                              profile.activityLevel === activity
                                ? styles.selectedButtonGroupText
                                : styles.buttonGroupText
                            }
                          >{activity}</Text>
                        </TouchableOpacity>
                   ))}

                <Text>Sleep Hours: {profile.sleepHours}</Text>
                <Slider
                    value={profile.sleepHours}
                    onValueChange={(value) => updateProfile('sleepHours', value)}
                    minimumValue={4}
                    maximumValue={12}
                    step={0.5}
                />

                <Text>Water Intake (L): {profile.waterIntake}</Text>
                <Slider
                    value={profile.waterIntake}
                    onValueChange={(value) => updateProfile('waterIntake', value)}
                    minimumValue={0.5}
                    maximumValue={5}
                    step={0.5}
                />

                <Text>Stress Level</Text>
                  {['Low', 'Medium', 'High'].map((stress, index) => (
                    <TouchableOpacity
                       key={index}
                        style={
                            profile.stressLevel === stress
                            ? styles.selectedButtonGroupButton
                            : styles.buttonGroupButton
                      }
                       onPress={() => updateProfile('stressLevel', stress)}
                    >
                       <Text
                            style={
                             profile.stressLevel === stress
                               ? styles.selectedButtonGroupText
                               : styles.buttonGroupText
                           }
                        >{stress}</Text>
                    </TouchableOpacity>
                ))}

                <Button
                    title="Save Changes"
                    onPress={handleSave}
                     buttonStyle={[styles.button, { marginTop: 20 }]}
                />
            </View>
        </ScrollView>
    );
};

export default ProfileEdit;