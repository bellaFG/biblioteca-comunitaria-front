try {
  $l = Invoke-RestMethod -Method Post -Uri 'http://localhost:5154/api/User/login' -ContentType 'application/json' -Body (@{email='test.ai+1@example.com'; password='123456'} | ConvertTo-Json)
  Write-Output 'LOGIN_OK'
  $l | ConvertTo-Json -Compress
  $token = $l.result.token
  Write-Output ('TOKEN:' + $token)
} catch {
  Write-Output 'LOGIN_ERROR'
  Write-Output $_.Exception.Message
}

if ($token) {
  try {
    $books = Invoke-RestMethod -Method Get -Uri 'http://localhost:5154/api/Book' -Headers @{ Authorization = 'Bearer ' + $token }
    Write-Output 'GET_BOOKS_OK'
    $books | ConvertTo-Json -Compress
  } catch {
    Write-Output 'GET_BOOKS_ERROR'
    Write-Output $_.Exception.Message
  }
} else {
  Write-Output 'NO_TOKEN'
}
