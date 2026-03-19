import React from 'react';

export default function ContextPanel({ context, onChange }) {
  return (
    <div className="glass p-8 mb-12">
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        2. Describe Your Context (Optional)
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>
        Provide any details about your role, industry, or company support to tailor agent blueprints.
      </p>
      
      <div>
        <textarea 
          name="context" 
          rows="3" 
          placeholder="e.g. HR Manager in Biotech wanting to automate employee onboarding workflows with secure doc access." 
          value={context || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="form-input"
          style={{ resize: 'none' }}
        />
      </div>
    </div>
  );
}
