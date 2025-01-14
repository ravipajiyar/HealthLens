import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Button, Input, Slider,  } from '@rneui/themed';
import styles from '../styles';
import { saveProfile } from '../utils/storage';


const ProfileSetup = ({ navigation }) => {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        healthGoals: '',
        dietaryPreferences: [],
        allergies: [],
        medicalConditions: [],
        activityLevel: '',
        sleepHours: 8,
        waterIntake: 2,
        stressLevel: ''
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const renderBasicInfo = () => (
        <View style={styles.container}>
            <Text h4 style={styles.sectionHeader}>Basic Information</Text>
            <Input
                placeholder="Name"
                value={profile.name}
                onChangeText={(value) => updateProfile('name', value)}
            />
            <Input
                placeholder="Age"
                keyboardType="numeric"
                value={profile.age}
                onChangeText={(value) => updateProfile('age', value)}
            />
            <Input
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={profile.weight}
                onChangeText={(value) => updateProfile('weight', value)}
            />
            <Input
                placeholder="Height (cm)"
                keyboardType="numeric"
                value={profile.height}
                onChangeText={(value) => updateProfile('height', value)}
            />
        </View>
    );


 const renderHealthGoals = () => (
    <View style={styles.container}>
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
    </View>
);

    const renderDietaryPreferences = () => (
        <View style={styles.container}>
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
        </View>
    );

    const renderAllergies = () => (
        <View style={styles.container}>
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
        </View>
    );

    const renderLifestyle = () => (
        <View style={styles.container}>
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


            <Text>Sleep (hours per night): {profile.sleepHours}</Text>
            <Slider
                value={profile.sleepHours}
                onValueChange={(value) => updateProfile('sleepHours', value)}
                minimumValue={4}
                maximumValue={12}
                step={0.5}
            />

            <Text>Water Intake (liters per day): {profile.waterIntake}</Text>
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
        </View>
    );


    const steps = [
        renderBasicInfo,
        renderHealthGoals,
        renderDietaryPreferences,
        renderAllergies,
        renderLifestyle,
    ];


    const handleSubmit = async () => {
        const success = await saveProfile(profile);
        if (success) {
            setShowSuccessMessage(true);
           // Set a timer for 2 seconds, after which it navigates.
           setTimeout(() => {
                navigation.replace('Home');
            }, 2000); // wait 2 second
        } else {
            Alert.alert('Error', 'Failed to save profile.');
        }
    };

     return (
        <ScrollView>
            <View style={styles.container}>
                {steps[step]()}
                <View style={styles.buttonContainer}>
                    {step > 0 && (
                        <Button
                            title="Previous"
                            onPress={() => setStep(step - 1)}
                             buttonStyle={styles.button}
                        />
                    )}
                    {step < steps.length - 1 ? (
                        <Button
                            title="Next"
                            onPress={() => setStep(step + 1)}
                             buttonStyle={styles.button}
                        />
                    ) : (
                         <Button
                            title="Complete"
                            onPress={handleSubmit}
                             buttonStyle={styles.button}
                        />
                    )}
                </View>
                {showSuccessMessage && (
                        <View style={{alignItems: 'center', marginTop: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>Profile Setup Completed!</Text>
                            <Text style={{fontSize: 16, color: '#666', textAlign: 'center' }}>You will be redirected to the home screen soon...</Text>
                        </View>
                    )}
            </View>
        </ScrollView>
    );
};

export default ProfileSetup;