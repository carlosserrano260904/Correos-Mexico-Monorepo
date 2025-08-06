import React, { useState } from 'react';

export default function PantallaPagoWeb() {
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
  });

  const tarjetasGuardadas = [
    {
      id: 1,
      last4: '4242',
      brand: 'Visa',
      expiry: '12/28',
      holder: 'Jammal Rodriguez',
    },
    {
      id: 2,
      last4: '1111',
      brand: 'MasterCard',
      expiry: '05/26',
      holder: 'Josue Rodriguez',
    },
  ];

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return cleaned.match(/.{1,4}/g)?.join(' ').substring(0, 19) || '';
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardInputChange = (field, value) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => window.history.back()} style={styles.backButton}>
          ←
        </button>
        <div style={styles.headerRightIcons}>
          <button style={styles.iconCircle}>♥</button>
          <button style={styles.iconCircle}>🛍</button>
        </div>
      </header>

      <div style={styles.tabContainer}>
        <button style={styles.tab}>Envío</button>
        <button style={{ ...styles.tab, ...styles.activeTab }}>Pago</button>
        <button style={styles.tab}>Resumen</button>
      </div>

      <main style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>Tarjeta de crédito / débito</h2>

        {/* Tarjetas simuladas */}
        {tarjetasGuardadas.map((t) => (
          <div key={t.id} style={styles.paymentOption}>
            <span style={styles.optionIconContainer}>💳</span>
            <div style={styles.optionTextContainer}>
              <div style={styles.optionText}>{`${t.brand} •••• ${t.last4}`}</div>
              <div style={styles.optionSubText}>{`Expira ${t.expiry}`}</div>
              <div style={styles.optionSubText}>{t.holder}</div>
            </div>
          </div>
        ))}

        <button style={styles.paymentOption} onClick={() => setShowCardForm(true)}>
          <span style={styles.optionIconContainer}>💳</span>
          <div style={styles.optionTextContainer}>
            <div style={styles.optionText}>Añadir tarjeta</div>
            <div style={styles.optionSubText}>Visa, MasterCard, American Express</div>
          </div>
        </button>

        {showCardForm && (
          <div style={styles.cardForm}>
            <h3 style={styles.formTitle}>Datos de la tarjeta</h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Número de tarjeta</label>
              <input
                style={styles.formInput}
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, ...styles.formGroupHalf }}>
                <label style={styles.formLabel}>Fecha de vencimiento</label>
                <input
                  style={styles.formInput}
                  placeholder="MM/AA"
                  value={cardData.expiryDate}
                  onChange={(e) => handleCardInputChange('expiryDate', formatExpiryDate(e.target.value))}
                />
              </div>
              <div style={{ ...styles.formGroup, ...styles.formGroupHalf }}>
                <label style={styles.formLabel}>CVV</label>
                <input
                  style={styles.formInput}
                  placeholder="123"
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nombre del titular</label>
              <input
                style={styles.formInput}
                placeholder="Nombre/s Apellido/s"
                value={cardData.holderName}
                onChange={(e) => handleCardInputChange('holderName', e.target.value)}
              />
            </div>

            <div style={styles.formButtons}>
              <button onClick={() => setShowCardForm(false)} style={styles.cancelButton}>Cancelar</button>
              <button onClick={() => alert('Tarjeta guardada')} style={styles.saveButton}>Guardar tarjeta</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// styles {...} (sin cambios)


const styles = {
  container: {
    fontFamily: 'sans-serif',
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    padding: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  backButton: {
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  headerRightIcons: {
    display: 'flex',
    gap: '1rem',
  },
  iconCircle: {
    backgroundColor: '#eee',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    borderBottom: '2px solid #ddd',
    marginBottom: '1rem',
  },
  tab: {
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottom: '2px solid #E91E63',
    color: '#E91E63'
  },
  mainContent: {
    padding: '1rem'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  optionIconContainer: {
    fontSize: '1.5rem',
    marginRight: '1rem',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontWeight: 'bold'
  },
  optionSubText: {
    color: '#777',
    fontSize: '0.9rem'
  },
  cardForm: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  formTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem'
  },
  formInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  formGroupHalf: {
    flex: 1
  },
  formButtons: {
    display: 'flex',
    gap: '1rem'
  },
  cancelButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  saveButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#E91E63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
