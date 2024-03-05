import React, { useState, useEffect } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [onlineStatus, setOnlineStatus] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onlineStatus) {
      alert('Unable to submit the form in offline mode. Data will be saved locally.');
      saveDataLocally(formData);
      setIsFormVisible(false); // Hide the form after saving data locally
      return;
    }

    // If in online mode, try to submit data to the database
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data);
        alert('User registered successfully');
        setIsFormVisible(false); // Hide the form after successful registration
        submitLocallySavedDataToDatabase(); // Attempt to submit locally saved data to the database
      } else {
        const errorData = await response.json();
        console.error('Error registering user:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveDataLocally = (data) => {
    // Save data locally using localStorage (you can replace this with a more robust solution)
    const storedData = JSON.parse(localStorage.getItem('offlineFormData')) || [];
    storedData.push(data);
    localStorage.setItem('offlineFormData', JSON.stringify(storedData));
  };

  const checkEmailAvailability = async (email) => {
    // Simulate checking if the email is available (replace with actual validation logic)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // For demo purposes, always consider email available
      }, 1000);
    });
  };

  const verifyEmail = async (email) => {
    // Simulate email verification (replace with actual verification logic)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // For demo purposes, always consider email verified
      }, 1500);
    });
  };

  const handleOnlineStatus = () => {
    setOnlineStatus(true);
    alert('You are now online! Attempting to submit locally saved data.');
    submitLocallySavedDataToDatabase();
  };

  const handleOfflineStatus = () => {
    setOnlineStatus(false);
    alert('You are now offline!');
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.style.setProperty('--background-color', newTheme === 'dark' ? '#333' : '#fff');
    document.documentElement.style.setProperty('--text-color', newTheme === 'dark' ? '#fff' : '#333');
  };

  const submitLocallySavedDataToDatabase = () => {
    // Attempt to submit locally saved data to the database when transitioning to online mode
    const storedData = JSON.parse(localStorage.getItem('offlineFormData')) || [];
    if (storedData.length > 0) {
      storedData.forEach(async (data) => {
        try {
          const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log('Locally saved data submitted successfully:', responseData);
            alert('Locally saved data submitted successfully');
          } else {
            const errorData = await response.json();
            console.error('Error submitting locally saved data:', errorData);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
      localStorage.removeItem('offlineFormData'); // Clear locally saved data after submission
    }
  };

  useEffect(() => {
    setIsFormVisible(true);
  }, [onlineStatus]);

  return (
    <div style={{ ...styles.pageContainer, background: 'var(--background-color)', color: 'var(--text-color)' }}>
      {isFormVisible && (
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Registration Form</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>
            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
        </div>
      )}
      <div style={styles.themeButtons}>
        <button onClick={handleThemeChange} style={styles.themeButton}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
      <div style={styles.statusButtons}>
        {onlineStatus ? (
          <button onClick={handleOfflineStatus} style={styles.statusButton}>
            Go Offline
          </button>
        ) : (
          <button onClick={handleOnlineStatus} style={styles.statusButton}>
            Go Online
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    transition: 'background 0.3s, color 0.3s',
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: '10px 0',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  themeButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  themeButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  statusButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  statusButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
};

export default RegistrationForm;
