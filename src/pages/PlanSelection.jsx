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
      // Auto-select Standard plan
      if (response.data.length > 0) {
        const standard = response.data.find(p => p.name === 'Standard');
        if (standard) {
          setSelectedPlan(standard);
        }
      }
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
      <div className="netflix-plan-container">
        <div className="loading">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="netflix-plan-container">
      <div className="netflix-header">
        <h1 className="netflix-logo">NETFLIX</h1>
      </div>

      <div className="plan-step-indicator">
        <span>Step 3 of 4</span>
      </div>

      <h2 className="plan-title">Choose the plan that's right for you</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="netflix-plans-grid">
        {plans && plans.length > 0 && plans.map((plan, idx) => (
          <div
            key={plan.id}
            className={`netflix-plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''} ${
              plan.name === 'Standard' ? 'most-popular' : ''
            }`}
            onClick={() => handleSelectPlan(plan)}
          >
            {plan.name === 'Standard' && <div className="most-popular-badge">Most Popular</div>}
            
            <h3 className="plan-name">{plan.name}</h3>
            {plan.name === 'Mobile' && <p className="plan-quality">480p</p>}
            {plan.name === 'Basic' && <p className="plan-quality">720p</p>}
            {plan.name === 'Standard' && <p className="plan-quality">1080p</p>}
            {plan.name === 'Premium' && <p className="plan-quality">4K + HDR</p>}
            
            <div className="monthly-price">
              <span>Monthly price</span>
              <div className="price-display">
                <span className="rupee-symbol">₹</span>
                <span className="price-amount">{Math.round(plan.price)}</span>
              </div>
            </div>

            <div className="plan-info">
              <div className="info-row">
                <span className="info-label">Video and sound quality</span>
                <span className="info-value">
                  {plan.name === 'Mobile' && 'Fair'}
                  {plan.name === 'Basic' && 'Good'}
                  {plan.name === 'Standard' && 'Great'}
                  {plan.name === 'Premium' && 'Best'}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Resolution</span>
                <span className="info-value">
                  {plan.name === 'Mobile' && '480p'}
                  {plan.name === 'Basic' && '720p (HD)'}
                  {plan.name === 'Standard' && '1080p (Full HD)'}
                  {plan.name === 'Premium' && '4K (Ultra HD) + HDR'}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Supported devices</span>
                <span className="info-value">{plan.features || 'TV, computer, mobile phone, tablet'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Devices your household can watch at the same time</span>
                <span className="info-value">{plan.maxScreens}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Download devices</span>
                <span className="info-value">
                  {plan.name === 'Mobile' && '1'}
                  {plan.name === 'Basic' && '1'}
                  {plan.name === 'Standard' && '2'}
                  {plan.name === 'Premium' && '6'}
                </span>
              </div>
            </div>

            <div className="plan-checkbox">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan?.id === plan.id}
                onChange={() => handleSelectPlan(plan)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="plan-footer">
        <button
          className="next-btn"
          onClick={handleContinue}
          disabled={!selectedPlan || submitting}
        >
          {submitting ? 'Processing...' : 'Next'}
        </button>
      </div>

      <div className="plan-disclaimer">
        <p>HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions. See our <a href="#terms">Terms of Use</a> for more details.</p>
        <p>Only people who live with you may use your account. Watch on 4 different devices at the same time with Premium, 2 with Standard, and 1 with Basic and Mobile.</p>
        <p>Live events are included with every Netflix plan and contain adverts.</p>
      </div>
    </div>
  );
}
