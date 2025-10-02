import { BrandHeader } from '../components/BrandHeader';

export default function Home() {
  return (
    <>
      <BrandHeader />
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to Julie Wallace's Nutritionist Platform</h1>
        <p>
          This is the beta version. Courses, programs, and more will be added soon!
        </p>
      </main>
    </>
  );
}
