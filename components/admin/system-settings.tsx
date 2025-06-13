"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SystemSettings() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // General settings
  const [siteName, setSiteName] = useState("Legacy")
  const [siteDescription, setSiteDescription] = useState("Family Memory Vault")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Security settings
  const [passwordMinLength, setPasswordMinLength] = useState(8)
  const [passwordRequireSpecial, setPasswordRequireSpecial] = useState(true)
  const [passwordRequireNumbers, setPasswordRequireNumbers] = useState(true)
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(true)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Storage settings
  const [maxUploadSize, setMaxUploadSize] = useState(10)
  const [allowedFileTypes, setAllowedFileTypes] = useState("image/*,video/*,audio/*")
  const [storageProvider, setStorageProvider] = useState("local")

  const handleSaveGeneralSettings = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Security settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveStorageSettings = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Storage settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input
                  id="site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">When enabled, only administrators can access the site</p>
                </div>
                <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Requirements</h3>

                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Minimum Password Length</Label>
                  <Input
                    id="password-min-length"
                    type="number"
                    min="6"
                    max="32"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="password-require-special">Require Special Characters</Label>
                  <Switch
                    id="password-require-special"
                    checked={passwordRequireSpecial}
                    onCheckedChange={setPasswordRequireSpecial}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="password-require-numbers">Require Numbers</Label>
                  <Switch
                    id="password-require-numbers"
                    checked={passwordRequireNumbers}
                    onCheckedChange={setPasswordRequireNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="password-require-uppercase">Require Uppercase Letters</Label>
                  <Switch
                    id="password-require-uppercase"
                    checked={passwordRequireUppercase}
                    onCheckedChange={setPasswordRequireUppercase}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-required">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Force all users to set up two-factor authentication</p>
                  </div>
                  <Switch id="two-factor-required" checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecuritySettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>Configure file storage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="max-upload-size">Maximum Upload Size (MB)</Label>
                <Input
                  id="max-upload-size"
                  type="number"
                  min="1"
                  max="100"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-file-types">Allowed File Types</Label>
                <Input
                  id="allowed-file-types"
                  value={allowedFileTypes}
                  onChange={(e) => setAllowedFileTypes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of MIME types (e.g., image/*, video/mp4)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage-provider">Storage Provider</Label>
                <Select value={storageProvider} onValueChange={setStorageProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="vercel-blob">Vercel Blob</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {storageProvider !== "local" && (
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-sm">
                    Additional configuration options for{" "}
                    {storageProvider === "vercel-blob" ? "Vercel Blob" : storageProvider.toUpperCase()} would appear
                    here.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStorageSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
