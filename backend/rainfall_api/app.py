# import numpy as np
# import pandas as pd
# import requests
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from sklearn.preprocessing import MinMaxScaler

# app = Flask(__name__)

# # Function to get real-time weather data
# def get_real_time_weather(api_key, lat, lon):
#     url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
#     response = requests.get(url)
#     print(response.json()) 
#     data = response.json()
#     return data

# # Preprocess the real-time weather data
# def preprocess_real_time_data(weather_data, scaler):
#     temperature = weather_data['main']['temp']
#     humidity = weather_data['main']['humidity']
#     pressure = weather_data['main']['pressure']

#     features = np.array([[temperature, humidity, pressure]])
#     features_scaled = scaler.transform(features)

#     # Convert to sequence format for LSTM model
#     seq_length = 10  # Same as used during training
#     features_sequence = np.repeat(features_scaled, seq_length, axis=0).reshape(1, seq_length, 3)

#     return features_sequence

# # Predict rainfall using the trained model
# def predict_rainfall(model, weather_data, scaler):
#     processed_data = preprocess_real_time_data(weather_data, scaler)
#     prediction = model.predict(processed_data)
#     return prediction[0][0]/2

# # API route for predicting rainfall
# @app.route('/predict_rainfall', methods=['POST'])
# def predict():
#     data = request.json
#     api_key = '98e027721603ca32cead5457312b406a'
#     lat = data.get('lat')
#     lon = data.get('lon')

#     # Load the pre-trained model
#     model = load_model('rainfall_model.h5')

#     # Load the scaler used for training
#     scaler = MinMaxScaler()
#     scaler.fit(pd.read_csv('final_NaviMumbai_weather (1).csv')[['temperature', 'humidity', 'pressure']].values)

#     # Get real-time weather data
#     weather_data = get_real_time_weather(api_key, lat, lon)

#     # Predict rainfall
#     rainfall_prediction = predict_rainfall(model, weather_data, scaler)

#     # Return the predicted rainfall as a JSON response
#     return jsonify({'predicted_rainfall': f'{rainfall_prediction:.2f} mm'})

# # Run the Flask app on port 5001
# if __name__ == "__main__":
#     app.run(port=5001, debug=True)

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras import layers
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the dataset
df = pd.read_csv('RainWater_Sub_Division_IMD_2017.csv')

# Separate numeric columns and fill missing values in numeric columns with mean
numeric_columns = df.select_dtypes(include=[np.number]).columns
df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())

# Features: Year and monthly rainfall data
X = df[['YEAR', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']]

# Target: Annual rainfall or monthly rainfall (e.g., predict JAN rainfall)
y = df['ANNUAL']

# Normalize the features (standardization)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Define the model architecture with regularization and dropout
model = tf.keras.Sequential()

# Input layer and hidden layers with L2 regularization and dropout
model.add(layers.Dense(64, activation='relu', input_shape=(X_train.shape[1],), 
                       kernel_regularizer=tf.keras.regularizers.l2(0.001)))
model.add(layers.Dropout(0.3))  # Dropout for regularization

model.add(layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.001)))
model.add(layers.Dropout(0.3))

model.add(layers.Dense(64, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.001)))
model.add(layers.Dropout(0.3))

# Output layer for regression (predicting continuous values)
model.add(layers.Dense(1))

# Compile the model (loss function is MSE for regression)
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), 
              loss='mean_squared_error', 
              metrics=['mean_absolute_error'])

# Train the model with early stopping
early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

history = model.fit(X_train, y_train, validation_data=(X_test, y_test), 
                    epochs=100, batch_size=32, callbacks=[early_stop])

# API route for predicting rainfall
@app.route('/predict_rainfall', methods=['POST'])
def predict():
    data = request.json
    year = data.get('year')
    jan = data.get('jan')
    feb = data.get('feb')
    mar = data.get('mar')
    apr = data.get('apr')
    may = data.get('may')
    jun = data.get('jun')
    jul = data.get('jul')
    aug = data.get('aug')
    sep = data.get('sep')
    oct = data.get('oct')
    nov = data.get('nov')
    dec = data.get('dec')

    # Create a numpy array from the input data
    input_data = np.array([[year, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]])

    # Scale the input data
    scaled_data = scaler.transform(input_data)

    # Make a prediction
    prediction = model.predict(scaled_data)

    # Return the prediction as a JSON response
    return jsonify({'predicted_rainfall': f'{prediction[0][0]:.2f} mm'})

# Run the Flask app on port 5001
if __name__ == "__main__":
    app.run(port=5001, debug=True)