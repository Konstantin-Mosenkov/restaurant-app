import { Outlet } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';

export default function MenuLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}