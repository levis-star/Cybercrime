import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Frontend render error', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page narrow">
          <div className="panel">
            <span className="eyebrow">App error</span>
            <h1>Something stopped the page from loading</h1>
            <p>{this.state.error.message}</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
