import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const TestSupabase = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log("🔍 Testing Supabase connection...");
      const response = await axios.get("http://localhost:3001/api/debugging/test-supabase");
      
      console.log("✅ Supabase Response:", response.data);
      
      if (response.data.users && response.data.users.length > 0) {
        console.log("👤 Users from Supabase:", response.data.users.length);
        console.log("👤 First user:", response.data.users[0]);
      }
      
      setData(response.data); 
      
    } catch (err) {
      console.error("❌ Supabase Test Failed:", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError({ message: "Connection failed: " + err.message });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-test on component mount
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <Button 
          onClick={testConnection}
          disabled={loading}
          className="mb-4"
        >
          {loading ? "Testing..." : "Test Connection"}
        </Button>

        {loading && (
          <div className="text-blue-500">Testing Supabase connection...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-red-700">Error</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {data && data.success && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-700 mb-2">✅ {data.message}</h3>
            <div className="space-y-4">
              {data.users && data.users.map((user, index) => (
                <div key={user.uuid || index} className="bg-white p-3 rounded border border-green-100">
                  <p className="text-sm">
                    <strong>Full Name:</strong> {user.full_name || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {user.email || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>UUID:</strong> {user.uuid || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Fields:</strong> {user.allFields?.join(', ')}
                  </p>
                </div>
              ))}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold">
                  View Full Response
                </summary>
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSupabase;

