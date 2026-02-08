import { useState } from 'react'
import { useEnsName, useEnsAddress, useEnsAvatar, useEnsText } from 'wagmi'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState('')

  // Detect input type (validation before submit)
  const isAddressInput = input.startsWith('0x') && input.length === 42
  const isEnsNameInput = input.includes('.eth') && input.length > 4
  const isInputValid = isAddressInput || isEnsNameInput

  // Detect submitted type (used for actual lookups)
  const isAddress = submitted.startsWith('0x') && submitted.length === 42
  const isEnsName = submitted.includes('.eth') && submitted.length > 4

  // Wagmi hooks (only run on submitted input)
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({ 
    address: isAddress ? submitted : undefined,
    chainId: 1
  })
  
  const { data: address, isLoading: addressLoading } = useEnsAddress({ 
    name: isEnsName ? submitted : undefined,
    chainId: 1
  })
  
  const nameToUse = ensName || (isEnsName ? input : null)
  
  const { data: avatar } = useEnsAvatar({ name: nameToUse })
  const { data: description } = useEnsText({ name: nameToUse, key: 'description' })
  const { data: twitter } = useEnsText({ name: nameToUse, key: 'com.twitter' })
  const { data: github } = useEnsText({ name: nameToUse, key: 'com.github' })
  const { data: website } = useEnsText({ name: nameToUse, key: 'url' })
  const { data: email } = useEnsText({ name: nameToUse, key: 'email' })
  
  const isLoading = ensNameLoading || addressLoading
  
  return (
    <div className="app">
      {/* HEADER */}
      <h1>🔍 ENS Lookup Tool</h1>
      <p className="subtitle">Search any ENS name or Ethereum address</p>
      
      {/* INPUT */}
      <div className="search-box">
        <form onSubmit={(e) => { e.preventDefault(); if (isInputValid) setSubmitted(input.trim()); }}>
          <input 
            type="text"
            placeholder="Enter ENS name (vitalik.eth) or address (0x...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={input && !isInputValid ? 'input-error' : ''}
          />
          <div className="buttons">
            <button type="submit" disabled={!isInputValid || isLoading}>Search</button>
            <button type="button" className="clear-btn" onClick={() => { setInput(''); setSubmitted(''); }}>Clear</button>
          </div>
        </form>
      </div>
      
      {/* RESULTS */}
      {input && (
        <div className="results">
          <h2>Results:</h2>
          
          <div className="result-item search-term">
            <strong>You searched:</strong> {submitted}
          </div>
          
          {/* LOADING STATE */}
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>⏳ Loading...</p>
              <p className="loading-subtext">Fetching data from Ethereum blockchain...</p>
            </div>
          )}
          
          {/* INVALID INPUT */}
          {input && !isInputValid && !isLoading && (
            <div className="error-box">
              <h3>❌ INVALID INPUT</h3>
              <p>Please enter either:</p>
              <ul>
                <li>A valid ENS name (e.g., vitalik.eth)</li>
                <li>A valid Ethereum address (0x...)</li>
              </ul>
              <div className="examples">
                <p><strong>Examples:</strong></p>
                <p>✅ vitalik.eth</p>
                <p>✅ 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
              </div>
            </div>
          )}
          
          {/* ENS NAME NOT FOUND */}
          {isEnsName && !address && !isLoading && submitted.length > 4 && (
            <div className="error-box">
              <h3>❌ ERROR</h3>
              <p>This ENS name is not registered or doesn't exist on the Ethereum blockchain.</p>
              <p>You can register it at:</p>
              <a href="https://app.ens.domains" target="_blank" rel="noopener noreferrer">
                🔗 https://app.ens.domains
              </a>
            </div>
          )}
          
          {/* ADDRESS WITH ENS NAME FOUND */}
          {isAddress && ensName && !isLoading && (
            <div className="success-box">
              <h3>✅ ENS NAME FOUND!</h3>
            </div>
          )}
          
          {/* ADDRESS WITHOUT ENS NAME */}
          {isAddress && !ensName && !isLoading && input.length === 42 && (
            <div className="warning-box">
              <h3>⚠️ NO ENS NAME</h3>
              <p>This address doesn't have an ENS name registered.</p>
              <p>The address is valid, but no text records or profile information available.</p>
            </div>
          )}
          
          {/* SHOW ENS NAME (if found from address) */}
          {isAddress && ensName && !isLoading && (
            <div className="result-item highlight">
              <span className="icon">📛</span>
              <strong>ENS Name:</strong> {ensName}
            </div>
          )}
          
          {/* SHOW ADDRESS (if found from ENS name) */}
          {isEnsName && address && !isLoading && (
            <div className="result-item">
              <span className="icon">📍</span>
              <strong>Address:</strong> 
              <code className="address-code">{address}</code>
            </div>
          )}
          
          {/* SHOW ADDRESS (if user entered address without ENS) */}
          {isAddress && !ensName && !isLoading && input.length === 42 && (
            <div className="result-item">
              <span className="icon">📍</span>
              <strong>Address:</strong> 
              <code className="address-code">{input}</code>
            </div>
          )}
          
          {/* AVATAR */}
          {avatar && !isLoading && (
            <div className="result-item avatar-item">
              <span className="icon">📷</span>
              <strong>Avatar:</strong>
              <img src={avatar} alt="avatar" className="avatar-image" />
            </div>
          )}
          
          {/* TEXT RECORDS */}
          {nameToUse && !isLoading && (
            <>
              {description && (
                <div className="result-item">
                  <span className="icon">📝</span>
                  <strong>Description:</strong> {description}
                </div>
              )}
              
              {twitter && (
                <div className="result-item">
                  <span className="icon">🐦</span>
                  <strong>Twitter:</strong> {twitter}
                </div>
              )}
              
              {website && (
                <div className="result-item">
                  <span className="icon">🌐</span>
                  <strong>Website:</strong> 
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {website}
                  </a>
                </div>
              )}
              
              {github && (
                <div className="result-item">
                  <span className="icon">💼</span>
                  <strong>GitHub:</strong> {github}
                </div>
              )}
              
              {email && (
                <div className="result-item">
                  <span className="icon">📧</span>
                  <strong>Email:</strong> {email}
                </div>
              )}
              
              {/* SHOW MISSING FIELDS */}
              {(!avatar || !description || !twitter || !website || !github || !email) && (
                <div className="info-box">
                  <h4>ℹ️ Some fields not set:</h4>
                  <ul>
                    {!avatar && <li>• No avatar</li>}
                    {!description && <li>• No description</li>}
                    {!twitter && <li>• No Twitter</li>}
                    {!website && <li>• No website</li>}
                    {!github && <li>• No GitHub</li>}
                    {!email && <li>• No email</li>}
                  </ul>
                </div>
              )}
            </>
          )}
          
          {/* TIP FOR ADDRESS WITHOUT ENS */}
          {isAddress && !ensName && !isLoading && input.length === 42 && (
            <div className="tip-box">
              <p>💡 <strong>Tip:</strong> This address owner can register an ENS name at 
                <a href="https://app.ens.domains" target="_blank" rel="noopener noreferrer">
                  {' '}https://app.ens.domains
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App