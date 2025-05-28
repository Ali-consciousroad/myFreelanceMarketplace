"use client";

import { useState } from "react";

export default function MissionTestPage() {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Create Mission</h1>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
          <select style={{ width: '100%', padding: '8px', borderRadius: '4px' }}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Daily Rate</label>
          <input 
            type="number" 
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            placeholder="Enter daily rate"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Timeframe (days)</label>
          <input 
            type="number" 
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            placeholder="Enter timeframe"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', minHeight: '100px' }}
            placeholder="Enter mission description"
          />
        </div>

        <button style={{ 
          width: '100%',
          padding: '10px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Create Mission
        </button>
      </div>
    </div>
  );
} 