'use client';

import React, { useState } from 'react';
import ReferenceRequestForm from './ReferenceRequestForm';
import MyReferencesList from './MyReferencesList';
import IncomingReferencesPanel from './IncomingReferencesPanel';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        <ReferenceRequestForm onSuccess={refresh} />
        <MyReferencesList refreshKey={refreshKey} />

      </div>

      <div className="mt-10">
        <IncomingReferencesPanel onAction={refresh} />
      </div>
    </div>
  );
}