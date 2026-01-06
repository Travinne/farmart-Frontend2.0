import { getLocal, setLocal, removeLocal } from './storage';



class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingSyncs = getLocal('pending_syncs') || [];
    
    
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }
  
  handleOnline() {
    this.isOnline = true;
    console.log('App is online, syncing pending operations...');
    this.processPendingSyncs();
  }
  
  handleOffline() {
    this.isOnline = false;
    console.log('App is offline, operations will be queued');
  }
  
  queueSync(operation) {
    this.pendingSyncs.push({
      ...operation,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    
    this.savePendingSyncs();
    
    if (this.isOnline) {
      this.processPendingSyncs();
    }
  }
  
  async processPendingSyncs() {
    if (!this.isOnline || this.pendingSyncs.length === 0) {
      return;
    }
    
    console.log(`Processing ${this.pendingSyncs.length} pending syncs`);
    
    
    const toProcess = [...this.pendingSyncs];
    
    for (const sync of toProcess) {
      try {
        
        
        console.log(`Syncing operation: ${sync.type} ${sync.endpoint}`);
        
        
        sync.status = 'completed';
        sync.completedAt = new Date().toISOString();
        
        
        this.pendingSyncs = this.pendingSyncs.filter(p => p.id !== sync.id);
        
        
        if (sync.onSuccess) {
          sync.onSuccess(sync.data);
        }
      } catch (error) {
        console.error('Sync failed:', error);
        sync.attempts = (sync.attempts || 0) + 1;
        
        if (sync.attempts >= 3) {
          sync.status = 'failed';
          sync.error = error.message;
          
          if (sync.onError) {
            sync.onError(error);
          }
          
          
          this.pendingSyncs = this.pendingSyncs.filter(p => p.id !== sync.id);
        }
      }
    }
    
    this.savePendingSyncs();
  }
  
  savePendingSyncs() {
    setLocal('pending_syncs', this.pendingSyncs);
  }
  
  getPendingSyncs() {
    return this.pendingSyncs;
  }
  
  clearPendingSyncs() {
    this.pendingSyncs = [];
    removeLocal('pending_syncs');
  }
  
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      pendingCount: this.pendingSyncs.length,
      pendingSyncs: this.pendingSyncs
    };
  }
}


const syncService = new SyncService();
export default syncService;