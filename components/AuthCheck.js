import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import Button from "../components/CustomButtons/Button.js";

export default function AuthCheck(props) {
  const { user } = useContext(UserContext);

  return user ? 
    props.children : 
    props.fallback || 
    (
      <Button color='success' fullWidth href='/login'>
        Залогиниться
      </Button>
    );
}

