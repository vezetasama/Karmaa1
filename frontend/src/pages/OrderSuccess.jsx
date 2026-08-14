import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../components/Loader';

/** Legacy route — always send users to the dashboard after payment. */
export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true, state: { paymentComplete: true } });
  }, [navigate]);

  return <PageLoader />;
}
