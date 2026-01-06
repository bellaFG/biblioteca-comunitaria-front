try {
  $r = Invoke-RestMethod -Method Post -Uri 'http://localhost:5154/api/User' -ContentType 'application/json' -Body (@{name='Test AI'; email='test.ai+1@example.com'; password='123456'} | ConvertTo-Json)
  Write-Output 'REGISTER_OK'
  $r | ConvertTo-Json -Compress
} catch {
  Write-Output 'REGISTER_ERROR'
  Write-Output $_.Exception.Message
}

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
    $b = Invoke-RestMethod -Method Post -Uri 'http://localhost:5154/api/Book' -ContentType 'application/json' -Headers @{ Authorization = 'Bearer ' + $token } -Body (@{title='LivroTesteAI'; author='AI'; publicationYear=2020} | ConvertTo-Json)
    Write-Output 'CREATE_BOOK_OK'
    $b | ConvertTo-Json -Compress
  } catch {
    Write-Output 'CREATE_BOOK_ERROR'
    Write-Output $_.Exception.Message
  }
} else {
  Write-Output 'NO_TOKEN'
}
