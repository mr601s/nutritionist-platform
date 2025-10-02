import { BrandHeader } from '../../components/BrandHeader';

export default function Checkout() {
  return (
    <>
      <BrandHeader />
      <main style={{ padding: '2rem' }}>
        <h1>Checkout</h1>
        <p>Purchase courses securely via Stripe here.</p>
      </main>
    </>
  );
}
