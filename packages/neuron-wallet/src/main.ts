import { app } from 'electron'

import WalletService from 'services/wallets'
import NetworksService from 'services/networks'
import NodeController from 'controllers/node'
import SyncController from 'controllers/sync'
import AppController from 'controllers/app'
import ApiController from 'controllers/api'
import { changeLanguage } from 'utils/i18n'
import env from 'env'

const appController = new AppController()

app.on('ready', async () => {
  changeLanguage(app.getLocale())

  ApiController.mount()

  NetworksService.getInstance().notifyAll()
  WalletService.getInstance().generateAddressesIfNecessary()
  if (!env.isTestMode) {
    await NodeController.startNode()
    SyncController.startSyncing()
  }

  appController.openWindow()
})

app.on('before-quit', async () => {
  if (!env.isTestMode) {
    // No need to stop syncing as background process will be killed
    NodeController.stopNode()
  }
})

app.on('activate', appController.openWindow)
