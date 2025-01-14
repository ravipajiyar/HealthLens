// components/Analyzer.js
import { nutrientNames } from '../tools/nutrients';
const Analyzer = ({ foodData, profile }) => {
  if (!foodData || !profile) {
    return {
      suggestion: 'Unknown',
      reasons: [{ type: 'error', message: 'No food data or profile available for analysis.' }],
    };
  }

  const { nutrients, ingredients } = foodData;
    const {
        healthGoals,
        dietaryPreferences,
        allergies,
        sleepHours,
        waterIntake,
        stressLevel
    } = profile;
  let reasons = [];
  let suggestion = "Suitable";

  // Helper function to check dietary preferences
    const checkDietaryPreferences = () => {
        if (dietaryPreferences && dietaryPreferences.length > 0 && ingredients) {
            const lowerCaseIngredients = ingredients.toLowerCase();
            if (dietaryPreferences.includes(1) && (lowerCaseIngredients.includes('meat') || lowerCaseIngredients.includes('chicken') || lowerCaseIngredients.includes('beef') || lowerCaseIngredients.includes('pork') || lowerCaseIngredients.includes('fish'))) {
                 reasons.push({type: 'diet', message: "Contains meat products, not suitable for vegetarians."});
                 suggestion = "Not Suitable";
             }
             if (dietaryPreferences.includes(2) && (lowerCaseIngredients.includes('milk') || lowerCaseIngredients.includes('cheese') || lowerCaseIngredients.includes('yogurt') || lowerCaseIngredients.includes('whey'))) {
                    reasons.push({ type: 'diet', message: "Contains dairy products, not suitable for vegans." });
                 suggestion = "Not Suitable";
             }
             if (dietaryPreferences.includes(3) && lowerCaseIngredients.includes('gluten')) {
                 reasons.push({ type: 'diet', message: "Contains gluten, not suitable for gluten-free diets." });
                 suggestion = "Not Suitable";
            }
         }
    }
  // Helper function to check for allergies
   const checkForAllergies = () => {
       if (allergies && allergies.length > 0 && ingredients) {
         const lowerCaseIngredients = ingredients.toLowerCase();
            if(allergies.includes(1) && lowerCaseIngredients.includes('nut')){
                reasons.push({ type: 'allergy', message: 'Contains nuts, not suitable for nut allergy.' });
                suggestion = 'Not Suitable'
            }
            if(allergies.includes(2) && lowerCaseIngredients.includes('dairy')){
                 reasons.push({ type: 'allergy', message:'Contains dairy products, not suitable for dairy allergy.' });
                suggestion = 'Not Suitable'
            }
            if(allergies.includes(3) && lowerCaseIngredients.includes('shellfish')){
               reasons.push({ type: 'allergy', message: 'Contains shellfish, not suitable for shellfish allergy.' });
               suggestion = 'Not Suitable'
            }
         }
  }
  const checkNutrientBalance = () => {
      if(nutrients){
         const energy = nutrients.find((item) => item.nutrientName === nutrientNames.ENERC_KCAL)?.unit || 0;
         const totalFat = nutrients.find(item => item.nutrientName === nutrientNames.FAT)?.unit || 0;
         const totalSugar = nutrients.find(item => item.nutrientName === nutrientNames.SUGAR)?.unit || 0;
            // Calories and weight loss
            if(healthGoals === "Weight Loss"){
               if(energy > 400){
                     reasons.push({type:'nutrient', message: 'This product is high in calories.'});
                  suggestion = "Consume in Moderation";
                }
           }

           if(totalFat > 30){
               reasons.push({type:'nutrient', message: 'This product is high in fat.'});
               suggestion = "Consume in Moderation";
            }
           if(totalSugar > 15){
                 reasons.push({ type:'nutrient', message: 'This product is high in sugar.'});
               suggestion = "Consume in Moderation";
           }
    }
  }
    checkDietaryPreferences();
    checkForAllergies();
    checkNutrientBalance();

    return {
        suggestion,
        reasons: reasons.length > 0 ? reasons : [{ type: 'info', message: "No specific issues found." }]
    };
};

export default Analyzer;