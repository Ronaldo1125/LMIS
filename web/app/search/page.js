import { Suspense } from 'react';
import Search from '../Components/Search/Search';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <Search />
    </Suspense>
  );
}