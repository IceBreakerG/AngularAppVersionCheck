/**
 * Author: Henrik Peinar
 * https://blog.nodeswat.com/automagic-reload-for-clients-after-deploy-with-angular-4-8440c9fdd96c
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { interval, Subscription } from 'rxjs'
import { MatSnackBar } from '@angular/material'

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  newVersionAvailable: boolean = false
  versionCheckInterval: Subscription

  // These will be replaced by the post-build.js script
  public currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}'
  public version = '{{POST_BUILD_ENTERS_VERSION_HERE}}'

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url) {
    // Timestamp these requests to invalidate caches
    this.http.get(url + '?t=' + new Date().getTime()).subscribe(
      (response: any) => {
        const hash = response.hash
        this.newVersionAvailable = this.hasHashChanged(this.currentHash, hash)

        // Stop checking for a new version if a new version is already available
        if (this.newVersionAvailable) {
          this.stopVersionChecking()

          this.currentHash = hash
          this.version = response.version

          let snackBarRef = this.snackBar.open(
            "Good news, there's a new version of this application available! Click Update to upgrade.",
            'Update',
            {
              duration: 14400000,
              panelClass: ['my-content', 'mat-simple-snackbar-action-info'],
              verticalPosition: 'top'
            }
          )

          snackBarRef.onAction().subscribe(() => {
            location.reload()
          })
        }
      },
      err => {
        console.error(err, 'Error checking version')
      }
    )
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false
    }

    return currentHash !== newHash
  }

  /**
   * Starts the version check interval for the specified frequency.
   * @param url - The URL to check for the application version.
   * @param {number} frequency - The frequency in milliseconds (defaults to 30 minutes).
   */
  public startVersionChecking(url, frequency = 1800000) {
    this.versionCheckInterval = interval(frequency).subscribe(x => {
      this.checkVersion(url)
    })
  }

  /** Stops the version check interval. */
  public stopVersionChecking() {
    this.versionCheckInterval.unsubscribe()
  }
}
