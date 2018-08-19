    <?php

    $LocationCode = $_POST['LocationCode'];
	$rowID = $_POST['rowID'];
   

	set_include_path(get_include_path() . PATH_SEPARATOR . 'phpseclib');
	include('Net/SSH2.php');

	$host = '10.10.19.30'; 
	$port = 22;
	$username = 'chinnapat.c';
	$password = 'ops3nqt';

	$targetNode = $LocationCode;
	$ssh = new Net_SSH2($host,$port);
	if (!$ssh->login($username, $password)) {
	// echo 'Cannot connect to '.$host;.
		  exit('Login Failed');
	 $ssh->disconnect();
	}
	
	else
	{
		$ssh->setTimeout(10);
	
		$ssh->read('~]$');
		$ssh->write("telnet ".$targetNode."\n");
		$ssh->read('>>User name:');
		$ssh->write($username.'@'."3bb\n");
		$ssh->read('>>User password:');
		$ssh->write($password."\n");
		$ssh->read('>');
		$ssh->write("enable\n");
		$ssh->read('#');
		$ssh->write("config\n");
		$ssh->read('config)#');
	
		


		
	    for($i = 2; $i >= 0; $i--)
		{
				$ssh->write("interface emu ".$i."\n");
				$ssh->read('#');

				$ssh->write("display power run info \n");
				$ssh->write("quit\n");
	
				$readResult = nl2br($ssh->read('%'));

				
				//echo $readResult;
		
		
				$pos = strpos($readResult, 'DC   voltage'	);

				if ($pos === false) {
					if($i==0)
					{
						echo "EMU not found";
					}

				}
				else{
					//echo $pos;
					echo substr($readResult,$pos+18,6).",".$rowID.",".$LocationCode;
					break;
				}
		} 
		$ssh->write("quit\nquit\ny\n \n");
		
		$ssh->disconnect();
	}
	
	
 ?>