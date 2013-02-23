require 'rubygems'
require 'sinatra/base'

class App < Sinatra::Base
  get '/*' do
    send_file 'public/index.html'
  end
end
