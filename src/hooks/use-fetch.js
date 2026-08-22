import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(token, options, ...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;

