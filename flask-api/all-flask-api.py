import tensorflow as tf
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from flask_cors import CORS
from PIL import Image
import io
# from tensorflow.keras.models import load_model
app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load the Keras model for hemorrhage detection
model_hemorrhage = tf.keras.models.load_model('hemorrhage_detection_model.h5')
target_size_hemorrhage = (128, 128)
model = tf.keras.models.load_model("heart_attack_risk_model.h5")

# Load the trained models for disease prediction from blood data
model_blood = joblib.load('blood_model.pkl')
scaler = joblib.load('scaler (1).pkl')

# Load the trained models for sleep and water intake scoring
model_sleep = joblib.load('model_sleep.pkl')
model_water = joblib.load('model_water.pkl')

# Load the trained model for symptom-based disease prediction
model_symptoms = joblib.load('disease_name.pkl')
all_symptoms = np.array([
    'itching', 'skin_rash', 'continuous_sneezing', 'shivering',
    'stomach_pain', 'acidity', 'vomiting', 'indigestion',
    'muscle_wasting', 'patches_in_throat', 'fatigue',
    'weight_loss', 'sunken_eyes', 'cough', 'headache',
    'chest_pain', 'back_pain', 'weakness_in_limbs', 'chills',
    'joint_pain', 'yellowish_skin', 'constipation',
    'pain_during_bowel_movements', 'breathlessness', 'cramps',
    'weight_gain', 'mood_swings', 'neck_pain', 'muscle_weakness',
    'stiff_neck', 'pus_filled_pimples', 'burning_micturition',
    'bladder_discomfort', 'high_fever', 'nodal_skin_eruptions',
    'ulcers_on_tongue', 'restlessness', 'dehydration', 'dizziness',
    'weakness_of_one_body_side', 'lethargy', 'nausea', 'abdominal_pain',
    'pain_in_anal_region', 'sweating', 'bruising', 'cold_hands_and_feets',
    'anxiety', 'knee_pain', 'swelling_joints', 'blackheads',
    'foul_smell_of_urine', 'skin_peeling', 'blister', 'dischromic_patches',
    'spotting_urination', 'passage_of_gases', 'extra_marital_contacts',
    'irregular_sugar_level', 'family_history', 'lack_of_concentration',
    'excessive_hunger', 'altered_sensorium', 'dark_urine', 'yellowing_of_eyes',
    'distention_of_abdomen', 'irritation_in_anus', 'swollen_legs', 'swollen_blood_vessels',
    'unsteadiness', 'inflammatory_nails', 'yellow_crust_ooze', 'muscle_pain',
    'receiving_blood_transfusion', 'acute_liver_failure', 'rusty_sputum',
    'redness_of_eyes', 'fast_heart_rate', 'swollen_extremeties',
    'dryness_of_mouth', 'polyuria', 'throat_irritation', 'scurring',
    'small_dents_in_nails', 'red_sore_around_nose', 'yellow_urine',
    'swollen_face', 'swollen_ankles', 'skin_rash', 'persistent_cough',
    'sore_throat', 'nasal_congestion', 'fever', 'chest_tightness',
    'joint_stiffness', 'loss_of_appetite', 'rapid_weight_loss',
    'joint_swelling', 'painful_urination', 'dry_cough', 'muscle_cramps',
    'heavy_bleeding', 'skin_wounds', 'dark_spots', 'excessive_thirst',
    'frequent_urination', 'tiredness', 'jaundice', 'paleness',
    'poor_appetite', 'difficulty_breathing', 'fluid_retention', 'sweaty_palms',
    'fainting', 'giddiness', 'blurred_vision', 'leg_cramps',
    'chronic_fatigue', 'burning_sensation', 'frequent_bowel_movements',
    'persistent_hiccups', 'hair_loss', 'painful_swellings', 'ear_pain',
    'stomach_cramps', 'indigestion', 'abdominal_bloating', 'chronic_itching',
    'pain_in_joints', 'chronic_fever', 'difficulty_swallowing', 'painful_cough'
])

# Helper functions
def preprocess_image(image_file):
    image = Image.open(io.BytesIO(image_file.read()))
    image = image.convert('L')
    image = image.resize(target_size_hemorrhage)
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    image_array = np.expand_dims(image_array, axis=-1)
    return image_array

def is_within_normal_ranges(data):
    NORMAL_RANGES = {
        'RBC': (4.5, 5.9),
        'PCV': (40.0, 52.0),
        'MCV': (80.0, 100.0),
        'MCH': (27.0, 31.0),
        'RDW': (11.5, 14.5),
        'TLC': (4.0, 11.0),
        'PLT /mm3': (150.0, 450.0),
        'HGB': (13.5, 17.5),
        'Age': (0, 120),
        'Sex': (0, 1),
        'MCHC': (32.0, 36.0)
    }
    for feature, value in data.items():
        if feature in NORMAL_RANGES:
            min_val, max_val = NORMAL_RANGES[feature]
            if not (min_val <= value <= max_val):
                return False
    return True

def symptoms_to_vector(user_symptoms, all_symptoms):
    user_symptoms = [symptom.replace(' ', '_') for symptom in user_symptoms]
    symptom_vector = np.zeros(len(all_symptoms))
    for symptom in user_symptoms:
        if symptom in all_symptoms:
            index = np.where(all_symptoms == symptom)[0]
            if index.size > 0:
                symptom_vector[index[0]] = 1
    return symptom_vector

def calculate_score(value, score_map):
    for threshold, score in sorted(score_map.items(), reverse=True):
        if value >= threshold:
            return score
    return 0

def calculate_sleep_score(sleep_duration, quality_of_sleep):
    sleep_duration_scores = {8: 20, 7: 15, 6: 10}
    quality_of_sleep_scores = {8: 20, 7: 15, 6: 10}
    
    sleep_score = calculate_score(sleep_duration, sleep_duration_scores)
    sleep_score += calculate_score(quality_of_sleep, quality_of_sleep_scores)
    
    return min(sleep_score, 50)

def calculate_water_score(physical_activity_level, stress_level):
    physical_activity_scores = {80: 20, 60: 15, 50: 10}
    stress_level_scores = {3: 20, 5: 15, 7: 10}
    
    water_score = calculate_score(physical_activity_level, physical_activity_scores)
    water_score += calculate_score(stress_level, stress_level_scores)
    
    return min(water_score, 50)
# Load the Saved Model


# Define Prediction Function
def predict_heart_attack_risk(data):
    """Predicts heart attack risk from smartwatch sensor data."""
    data = np.array(data).reshape(1, 2, 4, 1)  # Reshape input
    prediction = model.predict(data)
    risk_class = np.argmax(prediction)
    confidence = float(prediction[0][risk_class] * 100)
    risk_label = "High Risk" if risk_class == 1 else "Low Risk"
    
    return {"risk": risk_label, "confidence": confidence}

# Define API Endpoint
@app.route('/predict_heart', methods=['POST'])
def predict():
    try:
        # Get JSON Data
        json_data = request.get_json()
        new_data = json_data['data']  # Expecting a list of 8 sensor values
        
        # Make Prediction
        result = predict_heart_attack_risk(new_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route('/predict_health', methods=['POST'])
def predict_health():
    try:
        data = request.get_json()
        sleep_duration = data.get('sleep_duration', 0)
        quality_of_sleep = data.get('quality_of_sleep', 0)
        physical_activity_level = data.get('physical_activity_level', 0)
        stress_level = data.get('stress_level', 0)
        daily_steps = data.get('daily_steps', 0)
        bmi_category = data.get('bmi_category', 'Normal Weight')
        
        bmi_categories = ['Underweight', 'Normal Weight', 'Overweight', 'Obese']
        input_data = pd.DataFrame({
            'Sleep Duration': [sleep_duration],
            'Quality of Sleep': [quality_of_sleep],
            'Physical Activity Level': [physical_activity_level],
            'Stress Level': [stress_level],
            'Daily Steps': [daily_steps]
        })
        
        for category in bmi_categories:
            input_data[f'BMI Category_{category}'] = 0
        input_data[f'BMI Category_{bmi_category}'] = 1
        
        X_columns = [col for col in model_sleep.feature_names_in_ if col in input_data.columns]
        input_data = input_data.reindex(columns=X_columns, fill_value=0)
        
        # Debugging statements to check the input data and model attributes
        print("Input Data:", input_data)
        print("Model Sleep Attributes:", dir(model_sleep))
        print("Model Water Attributes:", dir(model_water))
        
        sleep_prediction = model_sleep.predict(input_data)[0]
        water_prediction = model_water.predict(input_data)[0]
        
        sleep_score = calculate_sleep_score(sleep_duration, quality_of_sleep)
        water_score = calculate_water_score(physical_activity_level, stress_level)
        
        total_score = sleep_score + water_score
        sleep_message = "You need to improve your sleep." if sleep_score < 40 else "Your sleep is fine."
        water_message = "You need to increase your water intake." if water_score < 40 else "Your water intake is fine."
        
        return jsonify({
            'health_score': total_score,
            'sleep_message': sleep_message,
            'water_message': water_message
        })
    
    except Exception as e:
        print(f"Error: {str(e)}") 
        return jsonify({'error': str(e)}), 400
    


# API Endpoints
@app.route('/predict_hemorrhage', methods=['POST'])
def predict_hemorrhage():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    preprocessed_image = preprocess_image(file)
    predictions = model_hemorrhage.predict(preprocessed_image)
    
    return jsonify(predictions.tolist())

# Define the correct feature order based on the training data
feature_order = ['Age','Sex',
    'RBC',
    'PCV',
    'MCV',
    'MCH',
    'MCHC',
    'RDW',
    'TLC',
    'PLT /mm3',
    'HGB']

# @app.route('/predict_blood', methods=['POST'])
# def predict():
#     # Get the data from the request
#     data = request.json
    
#     # Convert data to a DataFrame
#     df = pd.DataFrame([data])
    
#     # Ensure the incoming data matches the feature order
#     features = df[feature_order]
    
#     # Scale the features
#     features_scaled = scaler.transform(features)
    
#     # Make predictions
#     cluster = model_blood.predict(features_scaled)[0]
    
#     # Map cluster to disease type
#     cluster_to_disease = {
#         0: 'Diabetes',
#         1: 'Anemia',
#         2: 'Infections',
#         3: 'Liver Disease',
#         4: 'Kidney Disease',
#         5: 'Thyroid Disorders',
#         6: 'Heart Disease',
#         7: 'Autoimmune Diseases',
#         8: 'Cancer'
#     }
#     disease = cluster_to_disease[cluster]
    
#     return jsonify({'disease': disease})

@app.route('/predict_symptoms', methods=['POST'])
def predict_symptoms():
    data = request.json
    user_symptoms = data.get('symptoms', [])
    
    if not user_symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400
    
    symptom_vector = symptoms_to_vector(user_symptoms, all_symptoms)
    
    if len(symptom_vector) != 132:
        return jsonify({'error': f'Feature size mismatch: Expected 132, but got {len(symptom_vector)}'}), 400
    
    prediction = model_symptoms.predict([symptom_vector])
    prediction_list = prediction.tolist()
    
    return jsonify({'predicted_label': prediction_list})

if __name__ == '__main__':
    app.run(debug=True)
