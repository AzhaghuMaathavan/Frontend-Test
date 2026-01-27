import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/PlanSelection.css';

export default function PlanSelection() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchPlans();
  }, [user, navigate]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planService.getAllPlans();
      setPlans(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await authService.updatePlan(selectedPlan.id);
      
      if (response.data.success) {
        updateUser(response.data);
        navigate('/home');
      } else {
        setError(response.data.message || 'Failed to update plan');
      }
    } catch (err) {
      console.error('Error updating plan:', err);
      setError('Failed to update plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="plan-selection-container">
        <div className="loading">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="plan-selection-container">
      <div className="plan-header">
        <h1 className="netflix-logo">NETFLIX</h1>
        <h2>Choose Your Plan</h2>
        <p>Select a subscription plan that works for you</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            onClick={() => handleSelectPlan(plan)}
          >
            <div className="plan-header-card">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/month</span>
              </div>
            </div>

            <div className="plan-details">
              {plan.videoQuality && (
                <div className="plan-detail-item">
                  <span className="detail-label">Quality:</span>
                  <span className="detail-value">{plan.videoQuality}</span>
                </div>
              )}
              {plan.maxScreens && (
                <div className="plan-detail-item">
                  <span className="detail-label">Max Screens:</span>
                  <span className="detail-value">{plan.maxScreens}</span>
                </div>
              )}
            </div>

            {plan.features && (
              <div className="plan-features">
                <h4>Features:</h4>
                <ul>
                  {plan.features.split(',').map((feature, idx) => (
                    <li key={idx}>{feature.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {plan.description && (
              <p className="plan-description">{plan.description}</p>
            )}

            <div className="plan-selector">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan?.id === plan.id}
                onChange={() => handleSelectPlan(plan)}
              />
              <span>Select Plan</span>
            </div>
          </div>
        ))}
      </div>

      <div className="plan-actions">
        <button
          className="skip-btn"
          onClick={() => navigate('/home')}
          disabled={submitting}
        >
          Skip for Now
        </button>
        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selectedPlan || submitting}
        >
          {submitting ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
