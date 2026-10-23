import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import ItemForm from './components/ItemForm';
import FilterPills from './components/FilterPills';
import ItemCard from './components/ItemCard';
import { LoadingView, ErrorView, EmptyView } from './components/StateViews';
import Toast from './components/Toast';
import { getItems, createItem, toggleResolved, deleteItem } from './services/api';

export function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All'); // 'All' | 'Lost' | 'Found'
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('campus_theme') || 'sand';
    } catch {
      return 'sand';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('campus_theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'sand' ? 'chocolate' : 'sand'));
  };

  // Toast notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching items:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to the backend server. Ensure the server is running on the configured port.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Submit new notice
  const handleCreateItem = async (formData) => {
    setIsSubmitting(true);
    try {
      const created = await createItem(formData);
      // Prepend to items list
      setItems((prev) => [created, ...prev]);
      addToast(`"${created.title}" posted successfully!`, 'success');
      return true;
    } catch (err) {
      console.error('Error creating notice:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to submit notice. Please verify all fields.';
      addToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle resolved status
  const handleToggleResolved = async (id) => {
    try {
      const updated = await toggleResolved(id);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      addToast(
        updated.isResolved
          ? 'Notice marked as resolved!'
          : 'Notice reopened as active!',
        'info'
      );
    } catch (err) {
      console.error('Error updating status:', err);
      addToast('Failed to update notice status.', 'error');
    }
  };

  // Delete notice
  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      addToast('Notice deleted successfully.', 'info');
    } catch (err) {
      console.error('Error deleting notice:', err);
      addToast('Failed to delete notice.', 'error');
    }
  };

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter: 'All', 'Lost', 'Found'
      const matchesCategory =
        currentFilter === 'All' || item.category === currentFilter;

      // Keyword search (title & location)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.contactInfo?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, currentFilter, searchQuery]);

  // Metrics for filter pills
  const counts = useMemo(
    () => ({
      all: items.length,
      lost: items.filter((i) => i.category === 'Lost').length,
      found: items.filter((i) => i.category === 'Found').length,
    }),
    [items]
  );

  return (
    <>
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />

      <main className="app-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <span>Official Campus Lost &amp; Found Board</span>
          </div>
          <h2 className="hero-title">
            Lost Something? <span>Found Something?</span>
          </h2>
          <p className="hero-description">
            Connect with fellow students, faculty, and campus security to reunite lost
            belongings with their rightful owners quickly and safely.
          </p>
        </section>

        {/* Real-time Metrics Bar */}
        <StatsBar items={items} />

        {/* Main Content Layout: Form Sidebar + Noticeboard Feed */}
        <div className="main-layout">
          {/* Post Report Form */}
          <ItemForm
            onSubmitItem={handleCreateItem}
            isSubmitting={isSubmitting}
          />

          {/* Feed Section with 4 UI States */}
          <section className="feed-section" aria-labelledby="feed-heading">
            <h2 id="feed-heading" style={{ display: 'none' }}>
              Noticeboard Feed
            </h2>

            {/* Filter Pills and Search Bar */}
            <FilterPills
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Strictly Handled 4 UI States */}
            {/* 1. Loading State */}
            {loading && <LoadingView />}

            {/* 2. Error State */}
            {!loading && error && (
              <ErrorView error={error} onRetry={fetchItems} />
            )}

            {/* 3. Empty State */}
            {!loading && !error && filteredItems.length === 0 && (
              <EmptyView
                category={currentFilter}
                hasSearch={Boolean(searchQuery.trim())}
                onClearSearch={() => setSearchQuery('')}
              />
            )}

            {/* 4. Success State */}
            {!loading && !error && filteredItems.length > 0 && (
              <div className="cards-grid" role="feed" aria-busy="false">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onToggleResolved={handleToggleResolved}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </>
  );
}

export default App;
