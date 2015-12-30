# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.provider "virtualbox" do |vb|
        vb.memory = 4096
        vb.cpus = 4
        vb.name = "Connected Office Demo"
    end

    config.vm.provision :shell, path: "vagrant/install_java.sh", privileged: false
    config.vm.provision :file, source: "dse-4.5.1-bin.tar.gz", destination: "/home/vagrant/dse-4.5.1-bin.tar.gz"
    config.vm.provision :shell, path: "vagrant/download_dse.sh", privileged: false
    config.vm.provision :shell, path: "vagrant/start_dse/shark_solr.sh", privileged: false
    config.vm.provision :shell, path: "vagrant/wait_for_dse.sh", privileged: false
    config.vm.provision :shell, path: "vagrant/start_coffice.sh", privileged: false

    config.vm.synced_folder ".", "/vagrant", disabled: true
    config.vm.synced_folder ".", "/home/vagrant/coffice", create: true

    config.vm.network :forwarded_port, host: 3000, guest: 3000
    config.vm.box_check_update = true
    config.ssh.forward_x11 = true

    config.vm.post_up_message = "Welcome to the DataStax Connected Office Demo!\nhttp://localhost:3000"
end
