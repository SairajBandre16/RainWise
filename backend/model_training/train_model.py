import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

# Load and preprocess data
def load_data(filepath):
    data = pd.read_csv(filepath)
    return data

def preprocess_data(data):
    features = data[['temperature', 'humidity', 'pressure']].values
    target = data['rainfall'].values

    scaler = MinMaxScaler()
    features_scaled = scaler.fit_transform(features)

    def create_sequences(features, target, seq_length):
        X, y = [], []
        for i in range(len(features) - seq_length):
            X.append(features[i:i+seq_length])
            y.append(target[i+seq_length])
        return np.array(X), np.array(y)

    seq_length = 10
    X, y = create_sequences(features_scaled, target, seq_length)

    return X, y, scaler

# Generate synthetic data
def create_synthetic_data():
    np.random.seed(42)
    dates = pd.date_range(start='2024-01-01', periods=365, freq='D')
    temperature = np.random.uniform(low=15, high=25, size=365)
    humidity = np.random.uniform(low=50, high=80, size=365)
    pressure = np.random.uniform(low=1000, high=1020, size=365)
    rainfall = np.random.uniform(low=0, high=10, size=365)  # Random rainfall values

    data = pd.DataFrame({
        'date': dates,
        'temperature': temperature,
        'humidity': humidity,
        'pressure': pressure,
        'rainfall': rainfall
    })

    return data

# Save synthetic data for later use
def save_synthetic_data(data):
    data.to_csv('final_NaviMumbai_weather (1).csv', index=False)

# Create and save synthetic data
synthetic_data = create_synthetic_data()
save_synthetic_data(synthetic_data)

# Load and preprocess data
data = load_data('final_NaviMumbai_weather (1).csv')
X, y, scaler = preprocess_data(data)

# Split data
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, shuffle=False)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, shuffle=False)

# Build the LSTM model
model = Sequential()
model.add(LSTM(50, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2]), return_sequences=True))
model.add(LSTM(50, activation='relu'))
model.add(Dense(1))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Set up early stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=10)

# Train the model
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[early_stopping]
)

# Evaluate the model
loss = model.evaluate(X_test, y_test)
print(f'Test Loss: {loss}')

# Save the model
model.save('../rainfall_model_api/rainfall_model.h5')