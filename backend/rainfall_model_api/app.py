import numpy as np
import pandas as pd
import requests
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Function to get real-time weather data
def get_real_time_weather(api_key, lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    response = requests.get(url)
    print(response.json()) 
    data = response.json()
    return data

# Preprocess the real-time weather data
def preprocess_real_time_data(weather_data, scaler):
    temperature = weather_data['main']['temp']
    humidity = weather_data['main']['humidity']
    pressure = weather_data['main']['pressure']

    features = np.array([[temperature, humidity, pressure]])
    features_scaled = scaler.transform(features)

    # Convert to sequence format for LSTM model
    seq_length = 10  # Same as used during training
    features_sequence = np.repeat(features_scaled, seq_length, axis=0).reshape(1, seq_length, 3)

    return features_sequence

# Predict rainfall using the trained model
def predict_rainfall(model, weather_data, scaler):
    processed_data = preprocess_real_time_data(weather_data, scaler)
    prediction = model.predict(processed_data)
    return prediction[0][0]/2

# API route for predicting rainfall
@app.route('/predict_rainfall', methods=['POST'])
def predict():
    data = request.json
    api_key = '98e027721603ca32cead5457312b406a'
    lat = data.get('lat')
    lon = data.get('lon')

    # Load the pre-trained model
    model = load_model('rainfall_model.h5')

    # Load the scaler used for training
    scaler = MinMaxScaler()
    scaler.fit(pd.read_csv('final_NaviMumbai_weather (1).csv')[['temperature', 'humidity', 'pressure']].values)

    # Get real-time weather data
    weather_data = get_real_time_weather(api_key, lat, lon)

    # Predict rainfall
    rainfall_prediction = predict_rainfall(model, weather_data, scaler)

    # Return the predicted rainfall as a JSON response
    return jsonify({'predicted_rainfall': f'{rainfall_prediction:.2f} mm'})

# Run the Flask app on port 5001
if __name__ == "__main__":
    app.run(port=5001, debug=True)

