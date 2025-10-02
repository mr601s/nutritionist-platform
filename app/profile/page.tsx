import { BrandHeader } from '../../components/BrandHeader';

export default function Profile() {
  return (
    <>
      <BrandHeader />
      <main style={{ padding: '2rem' }}>
        <h1>Profile</h1>
        <p>Your account and progress info will appear here.</p>
      </main>
    </>
  );
}
