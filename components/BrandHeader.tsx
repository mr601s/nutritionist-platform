import Link from 'next/link';

export const BrandHeader = () => (
  <header className=\"brand-header\">
    <img src=\"/logo.png\" alt=\"Julie Wallace Logo\" className=\"brand-logo\" />
    <div>
      <div className=\"brand-title\">Julie Wallace</div>
      <div className=\"brand-subtitle\">Planted in Nutrition</div>
    </div>
    <nav>
      <Link href=\"/\">Home</Link>
      <Link href=\"/courses\">Courses</Link>
      <Link href=\"/dashboard\">Dashboard</Link>
      <Link href=\"/profile\">Profile</Link>
      <Link href=\"/checkout\">Checkout</Link>
    </nav>
  </header>
);
